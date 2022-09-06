import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { showComingSoon } from '../Error'

export default class AccessoryBar extends React.Component<any> {
  render() {
    const { onSend, isTyping } = this.props

    return (
      <View style={styles.container}>
        <Button onPress={showComingSoon} name='photo' />
        <Button onPress={showComingSoon} name='camera' />
        <Button onPress={showComingSoon} name='my-location' />
        <Button
          onPress={() => {
            isTyping()
          }}
          name='chat'
        />
      </View>
    )
  }
}

const Button = ({
  onPress,
  size = 30,
  color = 'rgba(0,0,0,0.5)',
  ...props
}) => (
  <TouchableOpacity onPress={onPress}>
    <MaterialIcons size={size} color={color} {...props} />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
})
