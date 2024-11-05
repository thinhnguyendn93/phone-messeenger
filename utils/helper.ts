export const groupCommunications = (
  communications: any[],
  currentPhone: any,
) => {
  const grouped: any = {}
  let currentTime

  for (const message of communications) {
    if (message.direction == 'out') {
      const from = message.from.TN
      const to = message.to
        .map((recipient: any) => recipient.TN)
        .sort()
        .join(',') // Create a unique key for 'to' numbers
      const key = `${from}|${to}` // Create a unique key combining 'from' and 'to'
      if (!grouped[key]) {
        currentTime = message.timeCreated
        grouped[key] = {
          type: message.type,
          direction: message.direction,
          from: message.from,
          to: message.to,
          messages: [],
          timeCreated:
            currentTime > message.timeCreated
              ? currentTime
              : message.timeCreated,
        }
      }

      grouped[key].messages.push({
        text: message.text,
        id: message.id,
        myStatus: message.myStatus,
        timeCreated: message.timeCreated,
        direction: 'out',
      })
    }
  }
  for (const message of communications) {
    if (message.direction == 'in') {
      const from = currentPhone
      const t = [...message.to, message.from].filter(
        (recipient) => !recipient.own,
      )
      const to = t
        .map((recipient) => recipient.TN)
        .sort()
        .join(',')
      const key = `${from}|${to}` // Create a unique key combining 'from' and 'to'
      if (!grouped[key]) {
        currentTime = message.timeCreated
        grouped[key] = {
          type: message.type,
          direction: message.direction,
          from: message.from,
          to: message.to,
          messages: [],
          timeCreated:
            currentTime > message.timeCreated
              ? currentTime
              : message.timeCreated,
        }
      }
      grouped[key].messages.push({
        text: message.text,
        id: message.id,
        myStatus: message.myStatus,
        timeCreated: message.timeCreated,
        direction: 'in',
      })
    }
  }

  // Convert grouped object to an array
  const results = Object.values(grouped).map((group: any) => ({
    type: group.type,
    direction: group.direction,
    from: group.from,
    to: group.to,
    messages: group.messages,
    timeCreated: group.timeCreated,
  }))
  return results
}

export const formatTime = (timestamp: any) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export const formatDate = (dateTime: any) => {
  const date = new Date(dateTime)
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }) // e.g., "Friday, Oct 25"
}

export const formatPhoneNumbers = (value: string) => {
  const numbers = value
    .split(',')
    .map((num) => num.trim())
    .filter((num) => num.length > 0) // Split by comma, trim and filter
  const formattedNumbers = numbers.map((num) => {
    const cleaned = num.replace(/[^0-9]/g, '') // Remove non-numeric characters
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10,
      )}` // Format full number
    }
    return cleaned // Return cleaned number if less than 10 digits
  })
  return formattedNumbers.join(', ') // Join formatted numbers with a comma and space
}

export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const result = e.target?.result as string
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsDataURL(file)
  })
}
