const getUtilisateurs = "SELECT * FROM users ORDER BY id";
const getUtilisateursById = "SELECT * FROM users WHERE id = $1";
const checkEmailExists = "SELECT s FROM users s WHERE s.email = $1";
const addUtilisateurs =
    "INSERT INTO users (pseudo,email,bio,password,token) VALUES ($1 ,$2 ,$3 ,$4 ,$5) RETURNING *";
const removeUtilisateurs = "DELETE FROM users WHERE id = $1";
const updateUtilisateurs = "UPDATE users SET pseudo = $1, email = $2, bio = $3 WHERE id = $4";
const getUtilisateursByEmail = "SELECT * FROM users WHERE email = $1"
// const updateEmailUtilisateur = "UPDATE users SET email = $1 WHERE id = $2";

module.exports = {
    getUtilisateurs,
    getUtilisateursById,
    checkEmailExists,
    addUtilisateurs,
    removeUtilisateurs,
    updateUtilisateurs,
    getUtilisateursByEmail,
    // updateEmailUtilisateur,
};