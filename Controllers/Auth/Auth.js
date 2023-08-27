// ##############Imports##############
const {
  MessageToUser,
  isEmailValid,
  StrongPassword,
} = require("../../services/main");

var express = require("express"),
  AuthRouter = express.Router(),
  uuid = require("uuid"),
  jwt = require("jsonwebtoken");
mongoose = require("mongoose");
// ##############Imports##############

// ##############Schema##############
let UserSchema = new mongoose.Schema({
  UserName: { type: String },
  Email: {
    type: String,
    require: true,
    index: true,
    unique: true,
    sparse: true,
  },
  Password: { type: String, require: true },
  UserId: {
    type: String,
    require: true,
    unique: true,
  },
  Image: {
    type: String,
  },
  Theme: {
    type: String,
  },
  Language: {
    type: String,
  },
  DataCreation: {
    type: Date,
  },
  IsDeleted: {
    type: Boolean,
  },
});
const UserModel = mongoose.model("users", UserSchema);

// ##############Schema##############

// ##############Router##############
AuthRouter.post("/SignUp", async (req, res) => {
  const { Email, Password, UserName } = req.body;
  if (Password !== undefined && Email !== undefined && UserName !== undefined) {
    if (isEmailValid(Email)) {
      if (Password.replace(/ /g, "").length > 0) {
        if (StrongPassword(Password)) {
          if (UserName.replace(/ /g, "").length > 5) {
            UserModel.find({
              Email: Email,
            }).then((users) => {
              if (users.length === 0) {
                UserModel.create({
                  DataCreation: new Date(),
                  Email,
                  Image: "",
                  IsDeleted: false,
                  Password,
                  Theme: "ligth",
                  UserId: uuid.v4(),
                  UserName,
                  Language: "en",
                }).then((User) => {
                  MessageToUser(
                    200,
                    "Ok",
                    {
                      User: User,
                    },
                    res
                  );
                });
              } else {
                MessageToUser(
                  400,
                  "Error",
                  {
                    MessageError: "This Email Already Exist !!",
                  },
                  res
                );
              }
            });
          } else {
            MessageToUser(
              400,
              "Error",
              {
                MessageError: "This User Name Must Be 5 Characters Of Than !!",
              },
              res
            );
          }
        } else {
          MessageToUser(
            400,
            "Error",
            {
              MessageError: "This Password Is Not Strong !!",
            },
            res
          );
        }
      } else {
        MessageToUser(
          400,
          "Error",
          {
            MessageError:
              "This Password Is Short Must Be 8 characters or than !!",
          },
          res
        );
      }
    } else {
      MessageToUser(
        400,
        "Error",
        {
          MessageError: "This Email InVaild !!",
        },
        res
      );
    }
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Full",
      },
      res
    );
  }
});
AuthRouter.post("/SignIn", (req, res) => {
  const { Email, Password } = req.body;
  if (Password !== undefined && Email !== undefined) {
    UserModel.findOne({
      Email: Email,
      Password: Password,
    }).then((User) => {
      if (User.length == 0) {
        MessageToUser(
          400,
          "Error",
          {
            Message:
              "This User Not Found && This Email Or Password Is InCorrect !!",
          },
          res
        );
      } else {
        MessageToUser(
          200,
          "Ok",
          {
            User: User,
          },
          res
        );
      }
    });
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Full",
      },
      res
    );
  }
});
AuthRouter.post("/ChangeImage", (req, res) => {
  const { UserId, ImageSrc } = req.body;
  if (UserId !== undefined && ImageSrc !== undefined) {
    if (UserId.length > 0) {
      ChangeUserData(
        UserId,
        {
          Image: ImageSrc,
        },
        res
      );
    } else {
      MessageToUser(
        400,
        "Error",
        {
          Message: "Must All Input Be Full !!",
        },
        res
      );
    }
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Be Full !!",
      },
      res
    );
  }
});
AuthRouter.post("/ChangeTheme", (req, res) => {
  const { UserId, Theme } = req.body;
  if (UserId !== undefined && Theme !== undefined) {
    if (UserId.length > 0 && Theme.length > 0) {
      ChangeUserData(UserId, { Theme }, res);
    } else {
      MessageToUser(
        400,
        "Error",
        {
          Message: "Must All Input Be Full !!",
        },
        res
      );
    }
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Be Full !!",
      },
      res
    );
  }
});
AuthRouter.post("/ChangeLanguage", (req, res) => {
  const { UserId, Language } = req.body;
  if (UserId !== undefined && Language !== undefined) {
    if (UserId.length > 0 && Language.length > 0) {
      ChangeUserData(UserId, { Language }, res);
    } else {
      MessageToUser(
        400,
        "Error",
        {
          Message: "Must All Input Be Full !!",
        },
        res
      );
    }
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Be Full !!",
      },
      res
    );
  }
});
AuthRouter.post("/ChangeUserName", (req, res) => {
  const { UserId, UserName } = req.body;
  if (UserId !== undefined && UserName !== undefined) {
    if (UserId.length > 0 && UserName.length > 0) {
      ChangeUserData(UserId, { UserName }, res);
    } else {
      MessageToUser(
        400,
        "Error",
        {
          Message: "Must All Input Be Full !!",
        },
        res
      );
    }
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Be Full !!",
      },
      res
    );
  }
});
AuthRouter.post("/ChangePassword", (req, res) => {
  const { UserId, Password } = req.body;
  if (UserId !== undefined && Password !== undefined) {
    if (UserId.length > 0 && Password.length > 0) {
      if (StrongPassword(Password)) {
        ChangeUserData(UserId, { Password }, res);
      } else {
        MessageToUser(
          400,
          "Error",
          {
            Message: "Your PassWord Must Be Strong !!",
          },
          res
        );
      }
    } else {
      MessageToUser(
        400,
        "Error",
        {
          Message: "Must All Input Be Full !!",
        },
        res
      );
    }
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Be Full !!",
      },
      res
    );
  }
});
AuthRouter.post("/DeleteUser", (req, res) => {
  const { UserId } = req.body;
  if (UserId.length > 0 && UserId !== undefined) {
    ChangeUserData(UserId, { IsDeleted: true }, res);
  } else {
    MessageToUser(
      400,
      "Error",
      {
        Message: "Must All Input Be Full !!",
      },
      res
    );
  }
});

const ChangeUserData = (UserId, DataChanged, res) => {
  UserModel.updateOne(
    {
      UserId,
    },
    DataChanged
  ).then(() => {
    UserModel.findOne({
      UserId,
    }).then((User) => {
      res.json(User);
    });
  });
};
// ##############Router##############
module.exports = AuthRouter;
