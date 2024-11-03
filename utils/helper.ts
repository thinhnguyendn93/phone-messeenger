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
