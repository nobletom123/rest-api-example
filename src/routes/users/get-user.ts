import express, { Request } from "express";
import { requireAuth } from "../../middlewares/require-auth";

import { User } from "../../models/user";

const router = express.Router();

router.get("/current-user", requireAuth, async (req, res) => {
  const userId = req.currentUser?.id;

  if (!userId) {
    res.send({ currentUser: null });
    return;
  }

  const user = await User.findById(userId);
  res.send({ currentUser: user });
});

export { router as currentUserRouter };
