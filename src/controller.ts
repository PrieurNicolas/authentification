import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtTokens } from "~~/utils/jwt-helpers";
import { users } from "./models/users-models";

const jhelper = require("../utils/jwt-helpers.ts");

export const refreshToken = (req: Request, res: Response) => {
  try {
    const refreshT = req.params.refresh_token;
    console.log(`Refresh Token is ${refreshT}`)
    if (refreshT === null) return res.status(400).json({ error: 'Null Refresh Token.' });
    jwt.verify(refreshT, process.env.REFRESH_TOKEN_SECRET as string, (error: any, user: any) => {
      if (error) return res.status(403).json({ error: error.message });
      let tokens = jwtTokens(user);
      res.json(tokens);
    })
  } catch (error) {
    return res.status(401).json({ error: "Could not refresh token." });
  }
}

export const getUtilisateurs = async (req: Request, res: Response) => {
  const allUsers = await users.findAll({order: ['id']});
  if (!allUsers) {
    return res.status(200).send("Aucun utilisateur trouvé, réessayez.");
  }
  res.status(200).json(allUsers)
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

export const loginUtilisateur = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
  const userfromEmail = await users.findOne({where:{email:email}});
  if (!userfromEmail) {
    return res.status(200).send("Email non trouvé, réessayez.");
  }
  const validPassword = await bcrypt.compare(password,userfromEmail.getDataValue('password'))
  if (!validPassword)
    return res.status(200).json({ error: "Mot de passe incorrect." });
  const tokens = await jhelper.jwtTokens(userfromEmail.getDataValue('password'));
  res.json([tokens,userfromEmail.getDataValue('id')]);
  } catch (error) {
    res.status(500).send(`Une erreur d'authentification est survenue.`);
  }
}

export const addUtilisateurs = async (req: Request, res: Response) => {
  const { pseudo, email, bio, password } = req.body;
  try {
    const checkEmail = await users.findOne({where:{email:email}});
    if (checkEmail) {
      return res.status(200).send("L'email est déjà utilisé.");
    }
    const checkPseudo = await users.findOne({where:{pseudo:pseudo}});
    if (checkPseudo) {
      return res.status(200).send("Le pseudo est déjà utilisé.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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

export const getUtilisateursById = async (req: Request, res: Response) => {
  const userfromId = await users.findByPk(parseInt(req.params.id));
  try {
    if (!userfromId) {
      return res.status(404).send("L'utilisateur n'existe pas.")
    }
    res.status(200).json(userfromId);
  } catch (error) {
    return res.send(error);
  }
}

export const removeUtilisateurs = async (req: Request, res: Response) => {
  const userfromId = await users.findByPk(parseInt(req.params.id));
  try {
    if (!userfromId) {
      return res.status(404).send("L'utilisateur n'existe pas.")
    }
    await users.destroy({where:{id:userfromId.getDataValue('id')}})
    return res.status(200).send(`Utilisateur supprimé avec succes.`);
  } catch (error) {
    return res.status(500).send(`Une erreur de suppression de compte est survenue.`);
  }
};

export const updateUtilisateurs = async (req: Request, res: Response) => {
  const { pseudo, email, bio, password } = req.body;
  const userfromId = await users.findByPk(parseInt(req.params.id));
  try {
    if (!userfromId) {
      return res.status(404).send("L'utilisateur n'existe pas.")
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userfromId.setDataValue('password', hashedPassword)
    }
    if (pseudo && userfromId.getDataValue('pseudo') != pseudo) {
      const userfromPseudo = await users.findOne({where:{pseudo:pseudo}});
      if (userfromPseudo) {
        return res.status(200).send("Pseudo dupliqué, mise à jour annulée.");
      }
      userfromId.setDataValue('pseudo', pseudo);
    } 
    if (email && userfromId.getDataValue('email') != email) {
      const userfromEmail = await users.findOne({where:{email:email}});
      if (userfromEmail) {
        return res.status(200).send("Email dupliqué, mise à jour annulée.");
      }
      userfromId.setDataValue('email', email);
    }
    if (userfromId.getDataValue('bio') != bio) {
      userfromId.setDataValue('bio', bio);
    }
    await userfromId.save();
    return res.status(200).send(`Utilisateur mis à jour avec succes.`);
  } catch (error) {
    return res.status(500).send(`Une erreur de mise à jour de compte est survenue.`);
  }
};
