const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export default corsHeaders;
