const { Octokit } = require("@octokit/rest")
const octokit = new Octokit()
const dayjs = require("dayjs")

const START_DATE = process.env.START_DATE || new dayjs('2021/09/28')

octokit
    .paginate('GET /repos/ec-cube/ec-cube/pulls', {
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 100
    }, (response, done) => {
        const data = response.data.filter(pull => {
            if (pull.merged_at === null) {
                return false
            }
            return dayjs(pull.merged_at).isAfter(START_DATE)
        })

        done() // todo とりあえず1ページで処理を終えとく
        return data
    })
    .then(pulls => {
        pulls.map(pull =>
            console.log(`#${pull.number}: ${pull.merged_at} ${pull.user.login}: ${pull.title}`)
        )
        console.log(pulls.length)
    })
    .catch(e => console.error(e))
