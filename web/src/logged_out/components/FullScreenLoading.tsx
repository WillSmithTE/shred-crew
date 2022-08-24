import React from "react"
import { colors } from "../../colors"
import ButtonCircularProgress from "../../shared/components/ButtonCircularProgress"

export const FullScreenLoading = () => {
    return <div style={{ position: 'absolute', backgroundColor: colors.background, opacity: 0.6, zIndex: 100, height: '100%', width: '100%' }}>
        <div style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <ButtonCircularProgress />
        </div>
    </div>

}