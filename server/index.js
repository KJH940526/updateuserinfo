const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");
app.use(cors());

const config = require("./config/key");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// 비디오 //비디오를 저장하기 위한 비디오 모델
const { Video } = require('./models/Video')

///추가추가 왕추가 비디오 이미지 스키마
const { Image } = require('./models/Image')

const multer = require("multer")
var ffmpeg = require('fluent-ffmpeg')



//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));



// // // console.log(multer);
// // // https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83
// // // fileFilter 옵션으로 검색해보기
// let storage = multer.diskStorage({
//   //파일을 올리리면 도착지가 uploads 폴더에다가 저장됨
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   // 로그한번 해보기
//   //파일이름을 정해줌
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
//   //파일필터는 mp4만 받을수 있게한다.
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (ext !== ".mp4") {
//     // if(ext !== ".mp4" || ext !== ".png"){ //png랑 mp4를 받고싶은경우
//       return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
//     }
//     cb(null, true);
//   },
// });

// // console.log("스토리지",storage);
//                         //옵션  //뒤에 스토리지는 위에서 정한 이름(멀터 옵션)
// const upload = multer({ storage: storage}).single("file")  //
//                                           //파일은 하나만(싱글)
//                                           //"file이 의미하는것은 fieldName 한번 알아보기"
//           //멀터 미들웨어
// // console.log("업로드",upload);


const mongoose = require("mongoose");



mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("몽고DB 연결중..."))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.send("Hello World!");
});


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png is allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

app.post("/api/image/uploadImage", (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});












// // 비디오정보를 몽고디비에 저장한다.
// app.post("/api/video/uploadVideo", (req, res) => {
//     //비디오 모델을 인스턴스로 만든다(new Video) 
//     new Video(req.body)

// });



// // 비디오
// app.post("/api/video/uploadfiles", (req, res) => {
//   // //req는 클라이언트에서 보내온거
//   // //클라이언트에 받은 비디오를 서버에 저장한다.
//   // //클라이언트에서 받은 비디오를 저장하기 위해서
//   // // multer라는 디펜던시를 추가한다.
//   // // 이 업로드는 위에서 만들어준 멀터 미들웨어
//   upload(req, res, err => {
//     if(err) {
//       return res.json({ success : false, err,})
//     }
//     //url은 파일을 업로드하면 uploads 폴더로 들어가는데 그 경로를 클라이언트에 보내줌
//     //파일 이름도 클라이언트로 보내줘야한다.

//    //url이랑 fileName은 우리가 클라인트로 보내줄떄 정의해주는 이름이고, 
//    //res.req.file.path는  //path는: Multer에서 정의했다. path 오른쪽 클릭 정의로 이동 해보기
//       return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename})
//   })                            //여기 url을 이용해서 클라리언트에 보내고 그걸 다시 보낸다 아래로
// });



// app.post("/api/video/thumbnail", (req, res) => {
//   let filePath = "";
//   let fileDuration ="";
//   console.log("1번 req.body 썸네일",req.body);
//   // 썸네일 생성 하고 비디오 러닝타임도 가져오기
//   //나중에 여기서 분기처리 한번 더 해줘야겠다
//   //비디오 정보 가져오기
//   ffmpeg.ffprobe(req.body.url, function(err,metadata){
//     // console.dir("dir",metadata);
//     // console.log("메타데이터",metadata);
//     console.log("비동기 떄문에 ?번 메타데이터 포맷",metadata.format.duration);
//     fileDuration = metadata.format.duration
//     console.log("파일듀레이션1",fileDuration);
//   })

//   //썸네일 생성
//   ffmpeg(req.body.url)
//   .on('filenames', function (filenames) {
//     console.log("2번 Will generate" + filenames.join(','))
//     console.log("3번 파일네임스",filenames)


//                                     //이유는 몰라도 서버 안에 있는 썸네일을 가져옴
//     filePath = "http://localhost:5000/uploads/thumbnails/" + filenames[0]
//     console.log("4번 파일 path",filePath);
//   })
//   .on('end', function(){
//     console.log("6번 스크린샷 taken")
//     console.log("end fileDuration", fileDuration);  //보낸는 이름   //정보가 들어있음
//     return res.json({ success: true, url: filePath, fileDuration: fileDuration})
//   })
//   .on('error', function(err){
//     console.log("에러",err);
//     return res.json({success: false, err,});
//   })
//   .screenshots({
//     count:1,
//     folder: "uploads/thumbnails/",
//     size:'320x240',
//     filename:'thumbnail-%b.png'
//   })
// });




//여기서 아이디 중복시 json을 리턴해주어서 분기처리해줘야한다.
app.post("/api/users/register", (req, res) => {
  console.log("reg",req.body)
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userInfo
    });
  });
});

app.post("/api/users/login", (req, res) => {
  console.log("login",req.body)
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렷습니다.",
        });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("x_auth", user.token) // .cookie('x_auth: ',user.token) 이거떄문에 에러생김
          .status(200) //user.id는 몽고디비 고유아이디
          .json({ loginSuccess: true, userId: user._id });
      });
    });

    if (!user.isVerified) {
      const Verifiedtoken = jwt.sign(user._id.toHexString(), "registerToken");
      // console.log()
      // const url = `${ip.address()}/${port}/confirmation/${Verifiedtoken}`
      const url2 = `http://localhost:3000/confirmation/${Verifiedtoken}`;
      if (err) {
        return res.json({ success: false, err });
      } else {
        console.log(user.email);
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bitbitlegit@gmail.com",
            pass: "!bit9000",
          },
        });
        const mailOptions = {
          from: "bitbitlegit@gmail.com",
          to: user.email, //req.body.email
          subject: "안녕하세요, 이메일 인증을 해주세요.",
          html: `Please, confirm your email by clicking the following link: <a href=${url2}>${url2}</a>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            // console.log(error);
          } else {
            // console.log(info)
          }
        });
      }
    }
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // console.log("auth index",req.user)
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,

     //password를 받는 이유는 비밀번호 수정할떄 쓰기위해서?
    //아니면 전체를 가져오는 다른 axios 요청을 가지고 클라이언트에 보내야함
    password : req.user.password,
    isVerified: req.user.isVerified,
    isSns : req.user.isSns
  })
});

app.get("/api/users/getConfirmation", auth, (req, res) => {
  console.log("get",req.body)
  console.log("get",req.user)
  console.log("req.user", req.user);
  console.log("getConfirm에 들어옴");
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { isVerified: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

app.get("/api/users/logout", auth, (req, res) => {
  console.log("log",req.body)
  console.log(",log",req.user)
  console.log("6번 req.user", req.user);
  User.findByIdAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.get("/api/users/resend", auth, (req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    console.log(req.user._id);
    const Verifiedtoken = jwt.sign(user._id.toHexString(), "registerToken");
    // console.log()
    // const url = `${ip.address()}/${port}/confirmation/${Verifiedtoken}`
    // const url1 = `localhost:3000/confirmation/`
    const url2 = `http://localhost:3000/confirmation/${Verifiedtoken}`;
    if (err) {
      return res.json({ success: false, err });
    } else {
      console.log("resend 이메일", user.email);
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "bitbitlegit@gmail.com",
          pass: "!bit9000",
        },
      });
      const mailOptions = {
        from: "bitbitlegit@gmail.com",
        to: user.email, //req.body.email
        subject: "안녕하세요, 이메일 인증을 해주세요.",
        html: `Please, confirm your email by clicking the following link: <a href=${url2}>${url2}</a>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          // console.log(error);
        } else {
          // console.log(info)
        }
      });
    }
    return res.status(200).send({
      success: true,
    });
  });
});





app.post("/api/users/modify", auth, (req, res)=>{
  console.log("auth 모디파이", req.user)
  User.findOne({ _id: req.user.id }, (err, user) => {
    console.log("파인드원",user)
  if (err) return res.json({ success: false, err });

    // console.log("user._id 아이디아이디", user._id)
    console.log("req.user 유저유저",req.user)
    console.log("req.body 바디바디",req.body)
  
    //req.body를 확인하기
  User.updateOne(
    {_id: user._id},
    {//$set을 해야 해당 필드만 바뀝니다. https://www.zerocho.com/category/MongoDB/post/579e2821c097d015000404dc
      $set: {       //req.body => body로 보내고
        password: req.body.newPassword,
        image: req.body.newImage,
        name: req.body.newName,
            },
    },
    console.log("req바디 패스워드",req.body.newPassword),
    (err,userInfo)=>{
      if(err) return res.json({success: false, err})
      return res.status(200).send({
        success:true,
        user : userInfo,
        })
      }
    )
  })
})





app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
