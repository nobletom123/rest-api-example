import express from "express";

const router = express.Router();

router.post("/users/sign-out", (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
