import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtTokens } from "~~/utils/jwt-helpers";
import { users, sequelize } from "./models/users-models";
import { pool } from "./models/dbConfig";

const queries = require("./queries");
const jhelper = require("../utils/jwt-helpers.ts");

const refreshToken = (req: Request, res: Response) => {
  try {
    const accessT = req.cookies.access_token;
    const refreshT = req.cookies.refresh_token;
    console.log(refreshT)
    if (refreshT === null) return res.status(401).json({ error: 'Null Refresh Token.' });
    if (accessT === null) return res.status(401).json({ error: 'Null Access Token.' });
    jwt.verify(accessT, process.env.ACCESS_TOKEN_SECRET as string, (error: any, user: any) => {
      if (error) return res.status(403).json({ error: error.message });
    })
    jwt.verify(refreshT, process.env.REFRESH_TOKEN_SECRET as string, (error: any, user: any) => {
      if (error) return res.status(403).json({ error: error.message });
      let tokens = jwtTokens(user);
      res.json(tokens);
    })
  } catch (error) {
    return res.status(401).json({ error: "Could not refresh token." });
  }
}

const getUtilisateurs = (req: Request, res: Response) => {
  pool.query(
    queries.getUtilisateurs,
    (error: ErrorRequestHandler, results: any) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    }
  );
};

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ error: "Null token" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (error, user) => {
    if (error) return res.status(403).json({ error: error.message });
    next();
  })
}

const loginUtilisateur = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  pool.query(
    queries.getUtilisateursByEmail,
    [email],
    async (error: ErrorRequestHandler, results: any) => {
      try {
        if (results?.rows?.length === 0) {
          return res.status(500).send("Email non trouvé, réessayez.");
        }
      } catch (error) {
        res.status(500).send(`Une erreur d'authentification est survenue.`);
      }
      try {
        const validPassword = await bcrypt.compare(
          password,
          results.rows[0].password
        );
        if (!validPassword)
          return res.status(401).json({ error: "Mot de passe incorrect." });
        const tokens = await jhelper.jwtTokens(results.rows[0]);
        res.json(tokens);
      } catch (error) {
        res.status(500).send(`Une erreur de hash est survenue.`);
      }
    }
  );
};

const addUtilisateurs = async (req: Request, res: Response) => {
  const { pseudo, email, bio, password } = req.body;
  try {
    const checkEmail = await users.findOne({where:{email:email}});
    if (checkEmail) {
      return res.status(200).send("L'email est déjà utilisé.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const checkPseudo = await users.findOne({where:{pseudo:pseudo}});
    if (checkPseudo) {
      return res.status(200).send("Le pseudo est déjà utilisé.");
    }
    const user = users.create({
      pseudo: pseudo,
      email: email,
      bio: bio,
      password: hashedPassword
    });
    return res.status(201).send("Création du compte utilisateur fait avec succès !");
  } catch (error) {
    return res.status(500).send(`Une erreur de création de compte est survenue.`);
  }
}

const getUtilisateursById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  pool.query(
    queries.getUtilisateursById,
    [id],
    (error: ErrorRequestHandler, results: any) => {
      try {
        if (!results?.rows) throw error;

        // If no users
        if (results.rows.length == 0) res.status(404);

        res.status(200).json(results.rows);
      } catch (error) {
        res.send(error);
      }
    }
  );
};

const removeUtilisateurs = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  pool.query(
    queries.getUtilisateursById,
    [id],
    (error: ErrorRequestHandler, results: any) => {
      const noUtilisateursFound = !results?.rows?.length;
      if (noUtilisateursFound) {
        res.status(500).send(`L'utilisateur n'existe pas.`);
      } else {
        pool.query(
          queries.removeUtilisateurs,
          [id],
          (error: ErrorRequestHandler, results: any) => {
            res.status(200).send(`Utilisateur supprimé avec succes.`);
          }
        );
      }
    }
  );
};

const updateUtilisateurs = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { pseudo, email, bio } = req.body;

  pool.query(
    queries.getUtilisateursById,
    [id],
    (error: ErrorRequestHandler, results: any) => {
      const noUtilisateursFound = !results.rows.length;
      if (noUtilisateursFound) {
        res.status(500).send(`L'utilisateur n'existe pas.`);
      } else {
        const pseudo2 = pseudo;
        const email2 = email;
        const bio2 = bio;

        if (pseudo == "") {
          res.send(`Entrez un pseudo.`);
        } else if (email == "") {
          res.send(`Entrez un email.`);
        } else if (bio == "") {
          res.send(`Entrez une bio.`);
        } else {
          pool.query(
            queries.updateUtilisateurs,
            [pseudo2, email2, bio2, id],
            (error: ErrorRequestHandler, results: any) => {
              if (error) throw error;
              res.status(200).send(`l'utilisateur à bien etait mis à jour`);
            }
          );
        }
      }
    }
  );
};

module.exports = {
  getUtilisateurs,
  getUtilisateursById,
  addUtilisateurs,
  removeUtilisateurs,
  updateUtilisateurs,
  loginUtilisateur,
  authenticateToken,
  refreshToken
};
