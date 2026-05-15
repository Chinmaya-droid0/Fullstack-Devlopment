import jwt from 'jsonwebtoken';

const isLoggedin = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token found, please login"
            });
        }
     
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded;
        next();

    } catch (error) {
      if(error.name === "jsonWebTokenError" || error.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token is invalid or Expired, please login again"
        });
      }
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
}


};

export default isLoggedin;