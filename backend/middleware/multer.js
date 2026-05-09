import multer from "multer";

const storage = multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,"./public")
    },

    filename:(req,file,cd)=>{
        cd(null, file.originalname)
    }
})

export const Upload = multer({storage})