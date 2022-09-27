const getUtilisateurs = "SELECT * FROM users";
const getUtilisateursById = "SELECT * FROM users WHERE id = $1";
const checkEmailExists = "SELECT s FROM users s WHERE s.email = $1";
const addUtilisateurs = 
        "INSERT INTO users (pseudo,email,password,token) VALUES ($1 ,$2 ,$3 ,$4)";
const removeUtilisateurs = "DELETE FROM users WHERE id = $1";
const updateUtilisateurs = "UPDATE users SET pseudo = $1 WHERE id = $2";

module.exports = {
    getUtilisateurs,
    getUtilisateursById,
    checkEmailExists,
    addUtilisateurs,
    removeUtilisateurs,
    updateUtilisateurs,
};