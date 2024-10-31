// Date Validator to ensure end date is after start date
export const dateValidator = {
  validator: function (this: any, endDate: Date) {
    if (!endDate) return true // Allow `endDate` to be optional
    const startDate = this.startDate
    return endDate >= startDate
  },
  message: 'End date must be after start date',
}
