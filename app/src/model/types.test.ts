import { twoDaysAgo, twoHoursAgo } from "./dummyData";
import { Conversation, sortConversations } from "./types";

describe.only('sortConversations', () => {
    it('sorts good', () => {
        const conversationNewest: Conversation = {
            created: twoHoursAgo().getTime(),
            id: '0',
            name: 'con0',
        }
        const conversationNewIsh: Conversation = {
            created: twoDaysAgo().getTime(),
            id: '1',
            name: 'con1',
        }
        const conversationMediumOld: Conversation = {
            created: twoDaysAgo().getTime(),
            id: '2',
            name: 'con2',
            message: { data: { text: '' }, time: twoHoursAgo().getTime(), user: 'abcd' }
        }
        const conversationOld: Conversation = {
            created: twoDaysAgo().getTime(),
            id: '3',
            name: 'con3',
            message: { data: { text: '' }, time: twoDaysAgo().getTime(), user: 'abcde' }
        }
        const sorted = sortConversations([conversationMediumOld, conversationOld, conversationNewest, conversationNewIsh])

        expect(sorted[0]).toEqual(conversationNewest)
        expect(sorted[1]).toEqual(conversationNewIsh)
        expect(sorted[2]).toEqual(conversationMediumOld)
        expect(sorted[3]).toEqual(conversationOld)
    })
});
