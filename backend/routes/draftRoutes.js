import express from 'express';
import { createDraft, updateDraft, getUserDrafts, deleteDraft } from '../controllers/draftController.js';
const router = express.Router();

router.post('/create', createDraft);        
router.put('/update', updateDraft);
router.delete('/delete', deleteDraft);
router.get('/user/:userId', getUserDrafts);      

export default router;
