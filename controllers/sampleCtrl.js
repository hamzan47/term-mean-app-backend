module.exports = {
    "getMenuController": (req, res, next) => {
        return res.jsonp({ message: "Welcome to our application." });
    }
}