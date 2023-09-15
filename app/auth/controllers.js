const sendEmail = require('../utils/sendMail')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("./User");
const {jwtOptions} = require("./passport");
const fs = require('fs');
const path = require("path");
const AuthCode = require("./AuthCode")

const sendVerificationEmail = async(req, res)=>{
  console.log(req.body);

  const code = String(Date.now()).slice(-6)


  await AuthCode.create({
      email:req.body.email,
      code: code
  })
  await sendEmail(req.body.email, "Код авторизации Instagram", code)

  res.status(200).end();
}

const signUp = async(req, res) => { 
  try { 
      // Поиск верификационного кода пользователя 
      const authCode = await AuthCode.findOne({ 
          where: {email: req.body.email}, 
          order: [['id', 'DESC']] 
      }) 
   
      // Проверка верификационного кода 
      if (!authCode || authCode.code !== req.body.code) { 
          res.status(401).send({ error: "Invalid verification code" }); 
      }  
   
      else{ 
          // Хеширование пароля и создание пользователя 
          let user = await User.findOne({where: {email: req.body.email}}); 
          const salt = await bcrypt.genSalt(10); 
          const hashedPassword = await bcrypt.hash(req.body.password, salt); 
       
          if(!user){ 
              user = await User.create({ 
                  email: req.body.email, 
                  username: req.body.username, 
                  password: hashedPassword, 
              })     
          } 
      } 
      res.status(200).send({ message: "Registration successful"});     
  } catch (error) { 
      console.error(error); 
      res.status(500).send({ error: 'Internal server error' });   
  } 
}

  const login = async (req, res) => {
    if(!req.body.username || req.body.username.length === 0 ||
      !req.body.password || req.body.password.length === 0){
        console.log(req.body.username);
        res.status(401).send({message : "Bad Credentials"});
      } else{

        const user = await User.findOne({
          where: {
            username: req.body.username
          }
        })

        if(!user) return res.status(401).send({message: "User with that username does not exist"});

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if(isMatch){

          const token = jwt.sign({
                    id: user.id, 
                    email: user.email,
                    password: user.password,
                    username: user.username, 
                    bio: user.bio,
                    user_image: user.user_image
                  }, jwtOptions.secretOrKey,
                  { expiresIn: 24 * 60 * 60 * 365});
                  res.status(200).send({token});

        } else {  
          res.status(401).send({message: "Password is incorrect"});
          }
      }
    }


    const editUser = async (req, res) => {
      const userId = req.user.id;
      console.log(req.file)
      try {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        fs.unlinkSync(path.join(__dirname + "../../../public/" + user.user_image));
    
        user.username = req.body.username;
        user.email = req.body.email;
        user.bio = req.body.bio;
        user.user_image = `/userLogo/${req.file.filename}`;
    
        await user.save();
    
        return res.status(200).send({ message: 'User data updated successfully' });
      } catch (error) {
        console.error('Error updating user data:', error);
        return res.status(500).send({ error: 'Internal server error' });
      }
    };
     

  module.exports = {
    sendVerificationEmail,
    signUp,
    login,
    editUser
  };