/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
module.exports = {
    name: '/api/userinfo',
    async exe(client, conf, req, res) {
        try {

        } catch (error) {
            console.log(error)
            res.status(500).JSON({ error: "some error happened", info: "report this if it happenes again." })
        }
    }
}