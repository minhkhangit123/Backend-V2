const pool = require('@configs/database');

const searchMovie = (data) => {
    return new Promise((reslove, reject) => {
        let arrResult = []
        const query = `SELECT * FROM movie WHERE MATCH (name)
            AGAINST (? IN NATURAL LANGUAGE MODE);`

        pool.query(query, [data], (err, results) => {

            if (err) {
                reject(err)
            }

            else {
                for (let i = 0; i < results.length; i++) {
                    arrResult.push(results[i])
                }

                const query1 = `SELECT * FROM movie ORDER BY RAND() LIMIT 10;`

                pool.query(query1, (err, results) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        for (let i = 0; i < results.length; i++) {
                            arrResult.push(results[i])
                        }
                        reslove(arrResult)
                    }
                })
            }
        })
    })
}

const countListMovie = () => {
    return new Promise((reslove, reject) => {
        const query = `SELECT COUNT(*) AS 'movie' FROM movie`

        pool.query(query, (err, results) => {

            if (err) {
                reject(err)
            }
            reslove(results)

        })
    })
}

const countList = () => {
    return new Promise((reslove, reject) => {
        const query = `SELECT COUNT(*) AS 'list' FROM list`

        pool.query(query, (err, results) => {

            if (err) {
                reject(err)
            }
            reslove(results)

        })
    })
}


const countUser = () => {
    return new Promise((reslove, reject) => {
        const query = `SELECT COUNT(*) AS 'user' FROM user;`

        pool.query(query, (err, results) => {

            if (err) {
                reject(err)
            }
            reslove(results)

        })
    })
}

const statistical = () => {
    return new Promise(async (reslove, reject) => {
        try {

            let numList = await countList()
            let numMovie = await countListMovie()
            let numUser = await countUser()
            let responseData = {
                movie: numMovie[0].movie,
                list: numList[0].list,
                user: numUser[0].user
            }

            reslove(responseData)

        } catch (err) {
            reject(err)
        }
    })
}

const addMovieView = (movieId) => {
    return new Promise((reslove, reject) => {
        var query = `SELECT * FROM interactive_movie WHERE id_movie = ? `
        pool.query(query, [movieId],(err, results) => {
            if (results.length == 0) {
                var query1 = `INSERT INTO interactive_movie (id_movie, view_count) VALUES(?,1)`
                pool.query(query1, [movieId], (err, results) => {
                    if (err) {
                        return reject(err)
                    }
                    reslove()
                })
            }
            else{
                var query1 = `UPDATE interactive_movie SET view_count = ?  WHERE id_movie = ?`
                pool.query(query1, [results[0].view_count + 1, movieId ], (err, results) => {
                    if (err) {
                        return reject(err)
                    }
                    reslove()
                })
            }
         
        })
    })
}

const getTopView = () => {
    return new Promise((reslove,results) => {
        var query = `SELECT mv.*, im.view_count FROM movie AS mv, interactive_movie AS im WHERE im.id_movie = mv.id ORDER BY view_count DESC`
        
        
        pool.query(query, (err, results) => {
            if (err) {
                return reject(err)
            }

            else return reslove(results)
        })
    })
}


const countNewUser = (fromTime, toTime) => {
    return new Promise((reslove,reject) => {
        var query = `SELECT COUNT(create_at) AS new_user FROM user WHERE create_at > ? AND create_at < ?`
        
        
        pool.query(query,[fromTime, toTime] ,(err, results) => {
            if (err) {
                return reject(err)
            }

            else return reslove(results[0])
        })
    })
}

module.exports = {
    searchMovie: searchMovie,
    statistical: statistical,
    addMovieView:addMovieView,
    getTopView:getTopView,
    countNewUser:countNewUser
}