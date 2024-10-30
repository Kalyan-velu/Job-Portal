import { sendErrorResponse, sendSuccessResponse } from '@server/common/response'
import { Company } from '@server/models/company.model'
import { Job } from '@server/models/job.model'
import type { JobInterface } from '@server/zod/job.schema'
import { Request, Response } from 'express'

interface JobCreateReq extends Request {
  body: JobInterface
}
export const createJob = async (req: JobCreateReq, res: Response) => {
  try {
    const { companyId } = req.user // Assumes req.user is populated after authentication middleware

    const company = await Company.findById(companyId)
    if (!company) {
      sendErrorResponse(res, 'Company not found', 404)
      return
    }

    const newJob = await Job.create({
      ...req.body,
      company,
      postedBy: req.user.id,
    })
    await newJob.save()
    sendSuccessResponse(res, newJob.toJSON())
    return
  } catch (e) {
    console.error('ℹ️ ~ file: job.controller.ts:8 ~ createJob ~ e:', e)
    sendErrorResponse(res, 'Failed to create job.', 500)
    return
  }
}

export const getActiveJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({
      company: req.user.companyId,
      isArchived: false,
    })
      .populate('company postedBy', 'name email')
      .sort({ createdAt: -1 })
    console.debug('ℹ️ ~ file: job.controller.ts:41 ~ getJobs ~ jobs:', jobs)
    sendSuccessResponse(res, jobs)
    return
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error })
  }
}

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'company postedBy',
      'name email',
    )
    if (!job) {
      sendErrorResponse(res, 'Job not found', 404)
      return
    }
    sendSuccessResponse(res, job.toJSON())
    return
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error })
    return
  }
}

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      req.body,
      { new: true },
    )
    if (!job) {
      sendErrorResponse(res, 'Job not found or unauthorized', 404)
      return
    }

    await job.save()
    sendSuccessResponse(res, job.toJSON(), 'Job updated succcessfully')
    return
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error })
    return
  }
}

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user.id,
    })
    if (!job) {
      sendErrorResponse(res, 'Job not found or unauthorized', 404)
      return
    }
    await job.deleteOne()
    sendSuccessResponse(res, null, 'Job deleted succcessfully')
    return
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error })
    return
  }
}

export const archiveJob = async (req: Request, res: Response) => {
  const { jobId } = req.params // Assume jobId is passed as a URL parameter
  try {
    const job = await Job.findByIdAndUpdate(
      jobId,
      { isArchived: true },
      { new: true },
    )

    if (!job) {
      res.status(404).json({ message: 'Job not found' })
      return
    }
    await job.save()
    sendSuccessResponse(res, job)
    return
  } catch (error) {
    res.status(500).json({ message: 'Failed to archive job', error })
    return
  }
}

// Unarchive a job
export const unarchiveJob = async (req: Request, res: Response) => {
  const { jobId } = req.params // Assume jobId is passed as a URL parameter
  try {
    const job = await Job.findByIdAndUpdate(
      jobId,
      { isArchived: false },
      { new: true },
    )

    if (!job) {
      res.status(404).json({ message: 'Job not found' })
      return
    }
    await job.save()
    sendSuccessResponse(res, job)
    return
  } catch (error) {
    console.error(
      'ℹ️ ~ file: job.controller.ts:147 ~ unarchiveJob ~ error:',
      error,
    )
    res.status(500).json({ message: 'Failed to unarchive job', error })
    return
  }
}

// List all archived jobs
export const listArchivedJobs = async (req: Request, res: Response) => {
  try {
    console.debug(
      'ℹ️ ~ file: job.controller.ts:155 ~ listArchivedJobs ~ req:',
      req.user,
    )
    const archivedJobs = await Job.find({
      company: req.user.companyId,
      isArchived: true,
    }).populate('company postedBy', 'name email')
    console.debug(
      'ℹ️ ~ file: job.controller.ts:159 ~ listArchivedJobs ~ archivedJobs:',
      archivedJobs,
    )

    sendSuccessResponse(res, archivedJobs)
    return
  } catch (error) {
    console.error(
      'ℹ️ ~ file: job.controller.ts:163 ~ listArchivedJobs ~ error:',
      error,
    )
    res.status(500).json({ message: 'Failed to fetch archived jobs', error })
    return
  }
}
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    console.debug(
      'ℹ️ ~ file: job.controller.ts:155 ~ listArchivedJobs ~ req:',
      req.user,
    )
    const archivedJobs = await Job.find({
      company: req.user.companyId,
    }).populate('company postedBy', 'name email')
    console.debug(
      'ℹ️ ~ file: job.controller.ts:159 ~ listArchivedJobs ~ archivedJobs:',
      archivedJobs,
    )

    sendSuccessResponse(res, archivedJobs)
    return
  } catch (error) {
    console.error(
      'ℹ️ ~ file: job.controller.ts:163 ~ listArchivedJobs ~ error:',
      error,
    )
    res.status(500).json({ message: 'Failed to fetch archived jobs', error })
    return
  }
}
