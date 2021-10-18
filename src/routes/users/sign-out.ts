import express from "express";

const router = express.Router();

router.post("/api/auth/sign-out", (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
