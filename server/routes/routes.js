import express from "express";
import connection from './../db/connections.js';
import authenticate from '../middleware/authMiddleware.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", authenticate , async (req, res) => {
    try{        
        return res.send({
            message: "Logged in"
        });
    }catch{
        return res.status(401).send({
            message: "unauthenticated"
        });
    }
});

router.get('/user', authenticate , async (req, res) => {
    try{
        const claims = req.user; // Get user claims from middleware
        
        const prompt = `SELECT *, 
        (SELECT COUNT(*) FROM splook.following_info WHERE userID = ${claims.id}) AS Following, 
        (SELECT COUNT(*) FROM splook.following_info WHERE FOLLOWS =  ${claims.id}) AS Followers
        FROM splook.user_info
        WHERE userID =  ${claims.id};`
        
        connection.execute(prompt, (err, result, field) => {
            if (err){
                console.error(err.stack);
            }
            const [user] = result
            const {Password, ...userInfo} = user;
            res.json(userInfo);    
        });
    }catch{
        return res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

router.get('/user/:id', authenticate, async (req, res) => {
    const prompt = `SELECT *, 
    (SELECT COUNT(*) FROM splook.following_info WHERE userID = ${req.params.id}) AS Following, 
    (SELECT COUNT(*) FROM splook.following_info WHERE FOLLOWS =  ${req.params.id}) AS Followers
    FROM splook.user_info
    WHERE userID =  ${req.params.id};`
    connection.execute(prompt, (err, result, field) => {
        if (err){
            return res.status(410).message({
                message: "User not found"
            });
        }
        const [user] = result
        const {Password, ...userInfo} = user;
        res.json(userInfo);    
    });
});

router.get("/answers", authenticate , async (req, res) => {
    try{
        const claims = req.user;

        const prompt = `SELECT *
            FROM (SELECT * 
                    FROM splook.answer_info NATURAL JOIN splook.question_info ) ans JOIN
                    (SELECT userID, Username
                    FROM splook.user_info) person
            ON ans.SenderID = person.userID
            WHERE ReceiverID = ${claims.id}
            ORDER BY Date_answered DESC;`
    
        connection.execute(prompt, (err, result, field) => {
            if (err){
                console.error(err.stack);
                return res.status(410).send({
                    message: "Entry not found"
                });
            }
            res.json(result);    
        });
    } catch{
        return res.status(401).send({
            message: "unauthenticated"
        });
    }
});

router.get("/answers/:id", authenticate, async (req, res) => {
    const prompt = `SELECT *
        FROM (SELECT * 
                FROM splook.answer_info NATURAL JOIN splook.question_info ) ans JOIN
                (SELECT userID, Username
                FROM splook.user_info) person
        ON ans.SenderID = person.userID
        WHERE ReceiverID = ${req.params.id};`

    connection.execute(prompt, (err, result, field) => {
        if (err) console.error(err.stack);
        res.json(result);    
    });
});


router.get("/logout", authenticate , async (req, res) =>{
    const cookie = req.cookies['jwt'];
    res.cookie('jwt', '' ,{  httpOnly: true, expires: new Date(0) });
    res.send({message: "Logout successfully"});
});

router.get("/questions", authenticate ,async (req, res) =>{
    try{
        const claims = req.user;

        const prompt = `SELECT *
        FROM splook.question_info
        WHERE ReceiverID = ${claims.id}
        ORDER BY Date_submitted DESC;`;
    
        connection.execute(prompt, (err, result, field) => {
            if (err) console.error(err.stack);
            res.json(result);    
        });
    } catch{
        return res.status(401).send({
            message: "unauthenticated"
        })
    }
});

router.get("/friends", authenticate, async (req, res) =>{
    try{
        const claims = req.user;
    
        const friendPrompt = `SELECT u.userID, First_Name AS name, username
        FROM splook.following_info f JOIN splook.user_info u
        ON f.Follows = u.UserID
        WHERE f.UserID = ${claims.id} AND Follows IN 
        (SELECT UserID
        FROM splook.following_info
        WHERE Follows = ${claims.id});`;

        const followingPrompt = `SELECT u.userID, First_Name AS name, username
            FROM splook.following_info f JOIN splook.user_info u
            ON Follows = u.userID
            WHERE f.userID = ${claims.id};`;
         
        const lastPrompt = `SELECT userID, First_Name AS name, username
            FROM splook.user_info
            WHERE userID != ${claims.id} AND userID NOT IN (
            SELECT Follows
            FROM splook.following_info
            WHERE UserID = ${claims.id});`;
        
        const output = {
            following: [],
            friends: [],
            others: []
        };

        connection.execute(friendPrompt, (err, result1, field) => {
            if (err) console.error(err.stack);
            output.friends = result1;
            connection.execute(followingPrompt, (err, result2, field) => {
                output.following = result2;
                connection.execute(lastPrompt, (err, result3, field) => {
                    output.others = result3;
                    res.json(output);    
                });
            });
        });


    } catch{
        return res.status(401).send({
            message: "unauthenticated"
        })
    }    
});

router.post("/edit", authenticate, async(req, res) => {
    try{
        const claims = req.user; 
    
        const prompt = `UPDATE splook.user_info
        SET First_Name = '${req.body.firstName}',
            Last_Name = '${req.body.lastName}'
            WHERE (userID = '${claims.id}');`;
        connection.execute(prompt, (err, results, field) => {
            if(err) console.log(err)
            return res.json({
                message: "Edit successful"
            })
        });

    }catch(error){
        console.log(error);
        return res.status(401).send({
            message: "unauthenticated"
        })
    }
});

router.delete("/user", authenticate, async (req, res) => {
    try{
        const claims = req.user;

        connection.execute(`DELETE FROM splook.user_info WHERE userID = ${claims.id}`, (err, results,fields) => {
            if (err) console.error(err.stack);
            console.log(results);
        });
    
        connection.execute(`DELETE FROM splook.answer_info WHERE ReceiverID = ${claims.id}`, (err, results,fields) => {
            if (err) console.error(err.stack);
            console.log(results);
        });
    
        connection.execute(`DELETE FROM splook.question_info WHERE ReceiverID = ${claims.id}`, (err, results,fields) => {
            if (err) console.error(err.stack);
            console.log(results);
        });

        connection.execute(`DELETE FROM splook.following_info WHERE Follows = ${claims.id}`, (err, results,fields) => {
            if (err) console.error(err.stack);
            console.log(results);
        });
        res.cookie('jwt', '' ,{  httpOnly: true, expires: new Date(0) });
        res.send({
            message: "Deleted Succesfully"
        });
    }catch{
        res.status(500).send({
            message: "Internal Server Error"  
        });
    }
});

router.delete("/answer/:ID", authenticate, async(req,res) => {
    const prompt = `DELETE FROM splook.answer_info 
    WHERE (AnswerID = ${req.params.ID});`
    connection.execute(prompt, (err, results,fields) => {
        if (err) console.error(err.stack);
        console.log(results);
    });
    res.send({
        message: "Deleted Succesfully"
    });
});

router.post("/unfollow", authenticate, async(req, res) => {
    try{
        const claims = req.user;

        const prompt = `DELETE FROM splook.following_info WHERE (UserID = '${claims.id}') and (Follows = '${req.body.follows}')`;

        connection.execute(prompt, (err, results, fields) => {
            if (err) console.error(err);
            res.send({
                message: "Delete successfully"
            })
        });
    }catch{
        console.log("NOT FOUND");
        return res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

router.post("/follow", authenticate, async(req, res) => {
    try{
        const claims = req.user;
    
        const prompt = `INSERT INTO splook.following_info VALUES ('${claims.id}', '${req.body.follows}')`;
        
        console.log(prompt);
        connection.execute(prompt, (err, results, fields) => {
            if(err) console.error(err);
            res.send(results);
        });
    }catch{
        return res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

router.post("/register", async (req, res) =>{
    // for hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Get current date
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd; 
    console.log(today)

    const newUser = {
        userID: 0,
        Username: req.body.username,
        First_Name: req.body.firstName,
        Last_Name: req.body.lastName,
        Email: req.body.email,
        Password: hashedPassword,
        Privacy: 0,
        date: today
    };

    connection.execute(`SELECT MAX(userID) + 1 AS newID from splook.user_info;`, (err, results, fields) => {
        newUser.userID = results[0].newID;
        const prompt = `INSERT INTO \`splook\`.\`user_info\` VALUES 
        ('${newUser.userID}',
        '${newUser.First_Name}',
        '${newUser.Last_Name}',
        '${newUser.Username}',
        '${newUser.Password}',
        '${newUser.Email}',
        '0',
        '${newUser.date}');`;
        connection.execute(prompt, (err, results, fields) => {
            if(err){
                return res.status(410).send({
                    message: "Username has been taken."
                })
            }
            res.send({
                message: "Created successfully"
            });
        });
    });
});

router.post("/login", async (req,res) =>{
    connection.execute(`SELECT * FROM splook.user_info WHERE Username = '${req.body.username}'`, async (err, results, fields) => {
        if (results.length === 0){
            return res.status(404).send({ message: "Username not found"});
        }

        const [user] = results;

        if(!await bcrypt.compare(req.body.password, user.Password)){
            console.log("invalid");
            return res.status(400).send({ message: `Invalid password`});
        }

        const token = jwt.sign({id: user.userID}, process.env.JWT_SECRET);
        
        try{
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: process.env.JWT_MAX_AGE,
            });
        }catch(e){
            console.log(e)
        }
        res.send({message: "Login success"});
    })
});

router.post('/answer', authenticate, (req,res) => {
    try{
        const claims = req.user;

        // Get current date
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;

        const newQuestion = {
            QuestionID: req.body.questionID,
            ReceiverID: claims.id,
            SenderID: req.body.senderID,
            Likes: 0,
            Date_answered: today,
            Answer_content: req.body.content
        };
        
        const prompt = `INSERT INTO splook.answer_info (QuestionID, ReceiverID, SenderID, Likes, Date_answered, Answer_content) 
        VALUES ('${newQuestion.QuestionID}', '${newQuestion.ReceiverID}', '${newQuestion.SenderID}', '${newQuestion.Likes}', '${newQuestion.Date_answered}', '${newQuestion.Answer_content}');`;
        connection.execute(prompt, (err, results, fields) => {
            if (err) console.error(err);
            console.log(results);
        })
        res.send({
            mesage: "Successful"
        })
    }catch{
        return res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

router.post('/question', authenticate, (req,res) => {
    try{
        const claims = req.user;

        // Get current date
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;

        const newUser = {
            ReceiverID: req.body.userID,
            SenderID: claims.id,
            Date: today,
            Anon: 1,
            Content: req.body.content
        };

        const prompt = `INSERT INTO splook.question_info (ReceiverID, SenderID, Date_submitted, Sender_anonymity, Question_content)
        VALUES ( '${newUser.ReceiverID}', '${newUser.SenderID}', '${newUser.Date}', '${newUser.Anon}', '${newUser.Content}');`;
        connection.execute(prompt, (err, results, fields) => {
            if (err) console.error(err);
            console.log(results);
        })
        res.send({
            mesage: "Successful"
        })
    }catch{
        return res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

export default router;