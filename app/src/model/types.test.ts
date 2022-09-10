import { twoDaysAgo, twoHoursAgo } from "./dummyData";
import { Conversation, sortConversations } from "./types";

describe.only('sortConversations', () => {
    it('sorts good', () => {
        const conversationNew: Conversation = {
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
        const sorted = sortConversations([conversationMediumOld, conversationOld, conversationNew])

        expect(sorted[0]).toEqual(conversationNew)
        expect(sorted[1]).toEqual(conversationMediumOld)
        expect(sorted[2]).toEqual(conversationOld)
    })
});
