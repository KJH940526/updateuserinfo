const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//type에서 쓰이는 Schema는 여기서 선언해줌 

const videoSchema = mongoose.Schema({

    writer: {
        type:Schema.Types.ObjectId,
        ref: 'User' //writer에 쓰는 사람의 ID를 넣는데
    },              //ID를 넣으면 User모델에서 모든 정보를 가져온다.
    title : {
      type: String,
      maxlength: 50,
    },
    description : {
      type:String
    },
    privacy: { // 클라이언트에서 0이면 프라이버시고 1이면 퍼블릭이라고 설정함
      type: Number
    },
    filePath : {
        type: String,
    },
    category : {
      type: String
    },
    views: {
      type: Number,
      default: 0
    },
    duration : {
      type: String
    },
    thumbnail: {
      type: String
    }
}, { timestamps: true }) 
    //만든 날짜와, 업데이트를 한 날짜를 표시할수 있음


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video } 