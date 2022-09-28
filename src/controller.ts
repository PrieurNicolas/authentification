import { ErrorRequestHandler, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = require('./models/dbConfig');
const queries = require('./queries');

const getUtilisateurs = (req: Request, res: Response) => {
    pool.query(queries.getUtilisateurs, (error: ErrorRequestHandler, results: any) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const loginUtilisateur = async (req: Request, res: Response) => {
    console.log("1")
        const {email, password} = req.body;
        console.log("2")
        const users = await pool.query(queries.getUtilisateursByEmail, [email], async (error: ErrorRequestHandler, results: any) => {
            try {
                console.log("3")
                if(results.rows.length === 0) {
                    console.log("3.5")
                res.status(500).send("Email non trouvé, réessayez.");
                }
            } catch (error) {
        res.status(500).send(`Une erreur d'authentification est survenue.`)
        }
        try {

        } catch (error) {}
        const validPassword = await bcrypt.compare(password,users.rows[0].password);
        if(!validPassword) return res.status(401).json({error:"Mot de passe incorrect."});
        return res.status(200).json("Connexion Réussie.")
    console.log("4")
})}

const addUtilisateurs = async (req: Request, res: Response) => {
    const { pseudo, email, bio, password, token } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        pool.query(queries.checkEmailExists, [email], (error: ErrorRequestHandler, results: any) => {
            if (results.rows.length) {
                res.status(500).send("L'email est déjà utilisé.")
            }
            else {
                if (pseudo == "") {
                    res.send(`Entrez un pseudo.`);
                } else
                    if (pseudo.length >= 30) {
                        res.send(`Pseudo trop long.`);
                    } else
                        if (email == "") {
                            res.send(`Entrez un email.`);
                        } else
                            if (email.length >= 50) {
                                res.send(`Email trop long`);
                            } else
                                if (bio == "") {
                                    res.send(`Entrez une bio.`);
                                } else
                                    if (password == "") {
                                        res.send(`Entrez un mot de passe.`);
                                    }
                                    if(password.length < 5){
                                        res.send(`Mot de passe trop petit.`);
                                    }
                                    else {
                                        //add utilisateur to bdd
                                        pool.query(queries.addUtilisateurs, [pseudo, email, bio, hashedPassword, token], (error: ErrorRequestHandler, results: any) => {
                                            res.status(201).send("Création du compte utilisateur, fait avec succes !")
                                        })
                                    }
            }
        });
    } catch (error) {
        res.status(500).send(`Une erreur de mot de passe est survenue.`)
    }
}

const getUtilisateursById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUtilisateursById, [id], (error: ErrorRequestHandler, results: any) => {
        try {
            const noUtilisateursFound = !results.rows.length
            if(noUtilisateursFound) throw error
            res.status(200).json(results.rows)
        } catch (error) {
            res.send(error)
        }
    })
}

const removeUtilisateurs = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getUtilisateursById, [id], (error: ErrorRequestHandler, results: any) => {
        const noUtilisateursFound = !results.rows.length;
        if (noUtilisateursFound) {
            res.status(500).send(`L'utilisateur n'existe pas.`);
        }
        else {
            pool.query(queries.removeUtilisateurs, [id], (error: ErrorRequestHandler, results: any) => {
                res.status(200).send(`Utilisateur supprimé avec succes.`);
            })
        }
    });
};

const updateUtilisateurs = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { pseudo, email, bio } = req.body;

    pool.query(queries.getUtilisateursById, [id], (error: ErrorRequestHandler, results: any) => {
        const noUtilisateursFound = !results.rows.length;
        if (noUtilisateursFound) {
            res.status(500).send(`L'utilisateur n'existe pas.`);
        }
        else {
            const pseudo2 = pseudo;
            const email2 = email;
            const bio2 = bio;

            if (pseudo == "") {
                res.send(`Entrez un pseudo.`);
            } else
                if (email == "") {
                    res.send(`Entrez un email.`);
                } else
                    if (bio == "") {
                        res.send(`Entrez une bio.`);
                    }
                    else {
                        pool.query(queries.updateUtilisateurs, [pseudo2, email2, bio2, id], (error: ErrorRequestHandler, results: any) => {
                            if (error) throw error;
                            res.status(200).send(`l'utilisateur à bien etait mis à jour`);
                        });
                    }


        }
    });
};


module.exports = {
    getUtilisateurs,
    getUtilisateursById,
    addUtilisateurs,
    removeUtilisateurs,
    updateUtilisateurs,
    loginUtilisateur,
};
