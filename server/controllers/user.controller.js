import models from "../models/index.js";
import bcrypt from "bcrypt";
import * as token from "../utilities/jwt.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "الإيميل مستخدم بالفعل" });
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    await models.User.create({
      name,
      email,
      password: hashedPassword,
    });

    return (
        res.status(201).json({ message: "تم إنشاء الحساب بنجاح" }),
        console.log(`User registered: ${name} ${email}`)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "خطأ في الخادم" });
  };
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "الإيميل أو كلمة المرور غير صحيحة" });
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "الإيميل أو كلمة المرور غير صحيحة" });
        };

        const tokenValue = token.generate({ id: user.id, email: user.email });
        return res.status(200).json({ token: tokenValue });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    };
};

export { register, login };