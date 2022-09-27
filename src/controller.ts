import { ErrorRequestHandler, Request, Response } from "express";

const pool = require('./models/dbConfig');
const queries = require('./queries');

const getUtilisateurs = (req: Request, res: Response) => {
    pool.query(queries.getUtilisateurs, (error: ErrorRequestHandler, results: any) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getUtilisateursById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUtilisateursById, [id], (error: ErrorRequestHandler, results: any) => {
        const noUtilisateursFound = !results.rows.length;
        if (noUtilisateursFound) {
            res.status(500).send(`L'utilisateur n'existe pas.`)
        }
        else {
            res.status(200).json(results.rows)
        }
    })
}

const addUtilisateurs = (req: Request, res: Response) => {
    const { pseudo, email, bio, password, token } = req.body;

    //check if email exists
    pool.query(queries.checkEmailExists, [email], (error: ErrorRequestHandler, results: any) => {
        if (results.rows.length) {
            res.status(500).send("L'email est déjà utilisé.")
        }
        else {
            //add utilisateur to bdd
            pool.query(queries.addUtilisateurs, [pseudo, email, bio, password, token], (error: ErrorRequestHandler, results: any) => {
                res.status(201).send("Création du compte utilisateur, fait avec succes !")
            })
        }
    });

};

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
            
            if(pseudo == ""){
              res.send(`Entrez un pseudo.`);
            }else
            if(email == ""){
                res.send(`Entrez un email.`);
            }else
            if(bio == ""){
                res.send(`Entrez une bio.`);
            }
            else{
                pool.query(queries.updateUtilisateurs, [pseudo2, email2, bio2, id], (error: ErrorRequestHandler, results: any) => {
                if (error) throw error;
                res.status(200).send(`l'utilisateur à bien etait mis à jour`);
            });
            }

            
        }
    });
};

// const updateEmailUtilisateurs = (req:Request, res:Response) => {
//     const id = parseInt(req.params.id);
//     const { email } = req.body;

//     pool.query(queries.getUtilisateursById, [id], (error: ErrorRequestHandler, results: any) => {
//         const noUtilisateursFound = !results.rows.length;
//         if (noUtilisateursFound) {
//             res.status(500).send(`L'utilisateur n'existe pas.`);
//         }
//         else {
//             pool.query(queries.updateEmailUtilisateurs, [email, id], (error: ErrorRequestHandler, results: any) => {
//                 if (error) throw error;
//                 res.status(200).send(`L'email de l'utilisateur à bien etaut mis à jour`);
//             });
//         }
//     });
// }


module.exports = {
    getUtilisateurs,
    getUtilisateursById,
    addUtilisateurs,
    removeUtilisateurs,
    updateUtilisateurs,
    // updateEmailUtilisateurs,
};
