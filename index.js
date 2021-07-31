const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv/config");

const bot = new Telegraf(process.env.TOKEN);
bot.start((ctx) => {
    ctx.telegram.sendMessage(786162360, ctx.message.from);
    ctx.reply(
        "Sizni bu botga kim taklif qildi bilmadimu lekin barbir hush kelibsiz!!! Nima qilish kerakligini o'sha odamdan so'rang."
    );
});
bot.help((ctx) =>
    ctx.reply("Yordam uchun sizni taklif qilgan odam bilan bog'laning!")
);
bot.on("poll", async (ctx) => {
    let question = ctx.message.poll.question.split("\n\n");

    let options = ctx.message.poll.options.map((option) => {
        return {
            option: option.text,
            isCorrect: false,
        };
    });

    let quiz = {
        question: question[0],
        tag: question[1],
        description: "Empty",
        options: options,
        tg_msg_id: ctx.message.message_id,
    };

    axios
        .post(process.env.QUIZ_POST, quiz)
        .then((response) => {
            if (response.data.success) {
                ctx.reply(
                    "Savol muvaffaqiyatli qo'shildi!\n\n Endi ushbu savolning javobini savolga reply qilib yozing. Adashib boshqa message ga reply qivormang yana :)"
                );
            } else {
                ctx.reply(`Savol kiritishda xatolik:\n\n${response.data}`);
            }
        })
        .catch(function (error) {
            ctx.reply(error);
        });
});
bot.on("text", (ctx) => {
    if (!ctx.message.reply_to_message) {
        ctx.reply("Birodar, reply qilishni unutdingiz shekilli🤨");
    } else {
        const answer = ctx.message.text;
        const answers = ["1", "2", "3", "4"];
        if (!answers.includes(answer)) {
            ctx.reply(
                "Nimalar qilyapsize😕. Esiz pasmi yo ataylab asabimmi buzmoqchimisiz🤨?"
            );
        } else {
            axios
                .post(process.env.QUIZ_UPDATE, {
                    id: ctx.message.reply_to_message.message_id,
                    answer: parseInt(answer) - 1,
                })
                .then((response) => {
                    if (response.data.success) {
                        ctx.reply(
                            "Ee barakalla, umringizdan baraka toping😊! Hammasi chiki-chiki bo'ldi👌"
                        );
                    } else {
                        ctx.reply(
                            `Iya bu yana qanday ko'rgulik bo'ldi, tezda @L1ttLe_Pr1nCe ga xabar qiling:\n\n${response.data}`
                        );
                    }
                })
                .catch(function (error) {
                    ctx.reply(error);
                });
        }
    }
});
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
