import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import Amplify from '@aws-amplify/core'
import 'antd/dist/antd.css'
import awsconfi from './aws-exports'
import { SketchPicker } from 'react-color'
import { Input, Button } from 'antd'
import { DataStore } from '@aws-amplify/datastore'
import { Message} from './models'
Amplify.configure(awsconfi)

const initialState = { color: '#000000', title: '', }

function App() {
  const [formState, updateFormState] = useState(initialState)
  const [messages, updateMessages] = useState([])
  const [showPicker, updateShowPicker] = useState(false)

  useEffect(() => { 
    fetchMessages()
    const subscription = DataStore.observe(Message).subscribe(() => fetchMessages())
    return () => subscription.unsubscribe()
  })

  function onChange(e) {
    if (e.hex) {
      updateFormState({ ...formState, color: e.hex })
    } else { updateFormState({ ...formState, title: e.target.value }) }
  }
  
  async function fetchMessages() {
    const messages = await DataStore.query(Message)
    updateMessages(messages)
  }
  async function createMessage() {
    if (!formState.title) return
    await DataStore.save(new Message({ ...formState }))
    updateFormState(initialState)
  }
  

    return (
      <div style={container}>
        
        <h1 style={heading}></h1>
        <input type='file'
        onChange={onChange}
        />
        
        <Input
          onChange={onChange}
          name='title'
          placeholder='Message title'
          value={formState.title}
          style={input}
        />
        <div>
          <Button onClick={() => updateShowPicker(!showPicker)}style={button}>Toggle Color Picker</Button>
          <p>Color: <span style={{fontWeight: 'bold', color: formState.color}}>{formState.color}</span></p>
        </div>
        {
          showPicker && <SketchPicker color={formState.color} onChange={onChange} />
        }
        <Button type='primary' onClick={createMessage}>added Video</Button>
        {
          messages.map(message => (
            <div key={message.id} style={{...messageStyle, backgroundColor: message.color}}>
              <div style={messageBg}>
                <p style={messageTitle}>
                  <ReactPlayer
                  controls
                  url={message.title}
                  />
                  {message.title}</p>
              </div>
            </div>
          ))
        }
      </div>
    )
}

const container = { width: '100%', padding: 40, maxWidth: 900 }
const input = { marginBottom: 10 }
const button = { marginBottom: 10 }
const heading = { fontWeight: 'normal', fontSize: 40 }
const messageBg = { backgroundColor: 'white' }
const messageStyle = { padding: '20px', marginTop: 7, borderRadius: 4 }
const messageTitle = { margin: 0, padding: 9, fontSize: 20  }

export default App
