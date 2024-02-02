import { ArrowLeft } from 'phosphor-react-native'
import React, { useState } from 'react'
import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native'
import { theme } from '../../theme'
import { styles } from './styles'
import { FeedbackType } from '../Widget'
import { feedbackTypes } from '../../utils/feedbackTypes'
import { ScreenshotButton } from '../ScreenshotButton'
import { Button } from '../Button'
import { captureScreen } from 'react-native-view-shot'
import { api } from '../../libs/api'
import * as FileSystem from 'expo-file-system'

interface Props {
    feedbackType: FeedbackType
    onFeedbackCanceled: () => void
    onFeedbackSent: () => void
}

export function Form({feedbackType, onFeedbackCanceled, onFeedbackSent}: Props) {
    const feedbackTypeInfo = feedbackTypes[feedbackType]
    const [screenshot, setScreenshot] = useState<string | null>(null)
    const [isSendingFeedback, setIsSendingFeedback] = useState(false)
    const [comment, setComment] = useState('')

    function handleScreenshot() {
        captureScreen({format: 'jpg', quality: 0.8}).then(uri => setScreenshot(uri)).catch(error => console.log(error))
    }
    function handleScreenshotRemove() {
        setScreenshot(null)
    }
    async function handleSendFeedback() {
        if (isSendingFeedback) {
            return
        } 

        setIsSendingFeedback(true)
        const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, {encoding: 'base64'})

        try {
            await api.post('/feedbacks', {
                type: feedbackType, 
                screenshot: `data:image/png;base64, ${screenshotBase64}`, 
                comment
            })
            onFeedbackSent()
        } catch(error) {
            console.log(error)
            setIsSendingFeedback(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onFeedbackCanceled}>
                    <ArrowLeft size="24" weight="bold" color={theme.colors.text_secondary} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Image source={feedbackTypeInfo.image} style={styles.image} />
                    <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
                </View>
            </View>
            <TextInput onChangeText={setComment} autoCorrect={false} multiline placeholder="Algo não está funcionando bem? Conte em detalhes oque está acontecendo..." placeholderTextColor={theme.colors.text_secondary} style={styles.input} />
            <View style={styles.footer}>
                <ScreenshotButton screenshot={screenshot} onTakeShot={handleScreenshot} onRemoveShot={handleScreenshotRemove} />
                <Button onPress={handleSendFeedback} isLoading={isSendingFeedback} />
            </View>
        </View>
    )
}
