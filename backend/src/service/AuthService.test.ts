import jwt from 'jsonwebtoken'
import { authService } from './AuthService'

describe('AuthService', () => {

    describe('verifyJwt', () => {
        it('should return undefined when expired or invalid', async () => {
            const expiredJwt = jwt.sign({}, '1234', { expiresIn: '0s' })
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            expect(authService.verifyJwt(expiredJwt, '1234')).toBeUndefined()
        })
    })
})
