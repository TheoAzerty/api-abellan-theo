const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

const { connectDB } = require("./config");
const User = require("../models/User");
const protect = require("../middleware/auth");

const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static("public"));

// Routes publiques
app.get("/", (req, res) => {
    res.redirect("/login");
});
// Page signup
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Page login
app.get("/login", (req, res) => {
    res.render("login");
});

// Signup
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.send("User already exists. Please choose a different email.");
        }

        // Créer un nouvel utilisateur
        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password
        });

        await newUser.save(); // hash du mot de passe via hook pre("save")

        res.send("User registered successfully!");
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Error occurred during signup");
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.send("User not found");

        // Vérifier le mot de passe
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) return res.send("Wrong password");

        // Générer un token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Stocker le token dans un cookie httpOnly
        res.cookie("token", token, { httpOnly: true });

        // Rediriger vers home
        res.redirect("/home");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Error during login");
    }
});

// Route protégée
app.get("/home", protect, (req, res) => {
    // req.user contient les infos du token décodé
    res.render("home", { user: req.user });
});

// Logout (optionnel)
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

app.get("/catways", protect, async (req, res) => {
    try {
        const catways = await Catway.find().sort({ createdAt: -1 });
        res.render("catways", { catways });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching catways");
    }
});

app.post("/catways", protect, async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;

        // Vérifier si le catwayNumber existe déjà
        const existingCatway = await Catway.findOne({ catwayNumber });
        if (existingCatway) {
            return res.send("Ce numéro de catway existe déjà !");
        }

        const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
        await newCatway.save();
        res.redirect("/catways");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding catway");
    }
});

app.post("/catways/delete/:id", protect, async (req, res) => {
    try {
        await Catway.findByIdAndDelete(req.params.id);
        res.redirect("/catways");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting catway");
    }
});

// Modifier un catway
app.post("/catways/edit/:id", protect, async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;

        // Vérifier si le nouveau numéro est déjà utilisé par un autre catway
        const existingCatway = await Catway.findOne({ catwayNumber, _id: { $ne: req.params.id } });
        if (existingCatway) {
            return res.send("Ce numéro de catway existe déjà !");
        }

        await Catway.findByIdAndUpdate(req.params.id, { catwayNumber, catwayType, catwayState });
        res.redirect("/catways");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la modification du catway");
    }
});

app.get("/reservations", protect, async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.render("reservations", { reservations });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des reservations");
    }
});

// Ajouter une reservation
app.post("/reservations", protect, async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

        const newReservation = new Reservation({
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        });

        await newReservation.save();
        res.redirect("/reservations");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'ajout de la reservation");
    }
});

// Supprimer une reservation
app.post("/reservations/delete/:id", protect, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect("/reservations");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression de la reservation");
    }
});

// Afficher tous les utilisateurs
app.get("/users", protect, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.render("users", { users });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des utilisateurs");
    }
});

// Supprimer un utilisateur
app.post("/users/delete/:id", protect, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/users");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression de l'utilisateur");
    }
});

// Modifier un utilisateur
app.post("/users/edit/:id", protect, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updateData = { username, email };

        if (password && password.length >= 6) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await User.findByIdAndUpdate(req.params.id, updateData);
        res.redirect("/users");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la modification de l'utilisateur");
    }
});

// Démarrage du serveur
const port = 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});