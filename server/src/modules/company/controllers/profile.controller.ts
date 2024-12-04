import type { Request, Response } from 'express'

import { sendErrorResponse, sendSuccessResponse } from '@server/common/response'
import { Company } from '@server/models/company.model'
import { User } from '@server/models/user.model'
import type { CompanyType } from '@server/zod-schema/company.schema'

interface CompanyCreateRequest extends Request {
  body: Omit<CompanyType, 'createdBy'>
}

export const Create = async (req: CompanyCreateRequest, res: Response) => {
  try {
    console.log(req.user.id)
    const details = req.body
    // Check if a company with the same name, site URL, or created by the user already exists
    const existingCompany = await Company.findOne({
      $or: [
        { name: details.name },
        { siteUrl: details.siteUrl },
        { createdBy: req.user.id },
      ],
    })

    if (existingCompany) {
      if (existingCompany.createdBy.toString() === req.user.id) {
        return sendErrorResponse(
          res,
          'You have already created a company. Please update your existing company details if needed.',
          409,
        )
      } else {
        return sendErrorResponse(
          res,
          'A company with this name or site URL already exists.',
          409,
        )
      }
    }

    const company = new Company({
      ...details,
      createdBy: req.user?.id,
    })

    await company?.save()
    const companyData = company?.toJSON()
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        companyId: company._id,
      },
      { new: true }, // This will return the updated user document
    )
    console.debug('ℹ️ ~ file: profile.controller.ts:41 ~ Create ~ user:', user)
    await user?.save()
    const updatedUser = user?.toJSON()
    sendSuccessResponse(res, { companyData, updatedUser }, 'Success')
    return
  } catch (e) {
    sendErrorResponse(res, e, 500)
    return
  }
}

interface CompanyUpdateRequest extends Request {
  body: Omit<CompanyType, 'createdBy'>
}

export const Update = async (
  req: CompanyUpdateRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.user?.companyId

    const details = req.body

    if (!id) {
      return sendErrorResponse(res, 'No id provided to update company.', 402)
    }

    // Find the existing company by its ID
    const company = await Company.findById(id)
    if (!company) {
      return sendErrorResponse(res, 'Company not found', 404)
    }

    // Check if the updated name or siteUrl already exists for other companies
    const existingCompany = await Company.findOne({
      _id: { $ne: id }, // Exclude the current company from the search
      $or: [{ name: details.name }, { siteUrl: details.siteUrl }],
    })

    if (existingCompany) {
      return sendErrorResponse(
        res,
        'Company with this name or site already exists',
        409,
      )
    }

    // Update only the necessary fields
    company.name = details.name || company.name
    company.industry = details.industry || company.industry
    company.siteUrl = details.siteUrl || company.siteUrl
    company.companySize = details.companySize || company.companySize
    company.based = details.based || company.based
    company.description = details.description || company.description
    company.socialMedia = details.socialMedia || company.socialMedia

    await company.save()

    sendSuccessResponse(res, company.toJSON(), 'Company updated successfully')
  } catch (e) {
    sendErrorResponse(res, e, 500)
    return
  }
}

export const GetMyCompanyProfiles = async (req: Request, res: Response) => {
  try {
    // Extract the user ID from the request (assuming it is available in req.user)
    const userId = req.user?.id // Ensure that req.user is populated correctly

    // Check if userId is defined
    if (!userId) {
      return sendErrorResponse(res, 'User not authenticated', 401)
    }

    // Find all companies created by the user
    const companies = await Company.find({ createdBy: userId })

    // Check if the user has any companies
    if (companies.length === 0) {
      return sendErrorResponse(res, 'No companies found for this user', 404)
    }

    // Send the company details as a response
    sendSuccessResponse(
      res,
      companies.map((company) => company.toJSON()),
      'Company profiles retrieved successfully',
    )
  } catch (error) {
    // Handle any errors that occur during the process
    sendErrorResponse(res, error, 500)
  }
}

export const GetMyCompanyById = async (req: Request, res: Response) => {
  try {
    // Extract the company ID from the request parameters
    const companyId = req.params.id

    // Extract the user ID from the request (assuming it is available in req.user)
    const userId = req.user?.id

    // Check if userId is defined
    if (!userId) {
      return sendErrorResponse(res, 'User not authenticated', 401)
    }

    // Find the company by ID and ensure it belongs to the user
    const company = await Company.findOne({
      _id: companyId,
      createdBy: userId,
    })

    // Check if the company exists
    if (!company) {
      return sendErrorResponse(res, 'Company not found or not authorized', 404)
    }

    // Send the company details as a response
    sendSuccessResponse(
      res,
      company.toJSON(),
      'Company profile retrieved successfully',
    )
  } catch (error) {
    // Handle any errors that occur during the process
    sendErrorResponse(res, error, 500)
  }
}

export const deleteCompany = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const companyId = req.params.companyId

    // Find the company by ID
    const company = await Company.findByIdAndDelete(companyId, {})

    // Check if the company exists
    if (!company) {
      return sendErrorResponse(res, 'Company not found', 404)
    }

    // Check if the user has permission to delete (assuming createdBy is the user who created the company)
    if (company.createdBy.toString() !== req.user._id.toString()) {
      return sendErrorResponse(
        res,
        'You do not have permission to delete this company',
        403,
      )
    }

    // Delete the company
    await company.deleteOne()

    // Optionally, you might want to update the user to remove the companyId association
    await User.findByIdAndUpdate(req.user._id, { $unset: { companyId: '' } })

    sendSuccessResponse(res, {}, 'Company deleted successfully')
  } catch (error) {
    console.error('Error deleting company:', error)
    sendErrorResponse(res, 'An error occurred while deleting the company', 500)
  }
}
