import bcrypt from "bcrypt"

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const cookieExtractor = req => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies["authCookie"]
    }
    return token;
}

export function getPrevLink(baseUrl, result) {
    return baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`);
}

export function getNextLink(baseUrl, result) {
    return baseUrl.includes('page') ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`);
}
