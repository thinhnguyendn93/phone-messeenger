export const useToast = () => {
  const error = async (message: string) => {
    const toast = await toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
    })

    await toast.present()
  }

  return {
    error,
  }
}
