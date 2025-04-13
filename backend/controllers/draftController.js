import User from '../models/User.js';

export const createDraft = async (req, res) => {
  const { userId, role, draftText } = req.body;
//   console.log("Received POST /drafts/create");
//     console.log("Request Body:", req.body);

  try {
    const user = await User.findById(userId);
    //console.log(user);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Check if role already exists
    const existing = user.drafts.find((d) => d.role === role);
    if (existing) return res.status(400).json({ error: 'Draft already exists for this role' });

    user.drafts.push({ role, draftText });
    await user.save();
    res.status(201).json({ message: 'Draft created successfully', drafts: user.drafts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create draft' });
  }
};

export const updateDraft = async (req, res) => {
  const { userId, role, draftText } = req.body;
  //console.log("req.body in updatefun: ",req.body);

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const draft = user.drafts.find((d) => d.role === role);
    if (!draft) return res.status(404).json({ error: 'Draft not found' });

    draft.draftText = draftText;
    await user.save();
    res.status(200).json({ message: 'Draft updated', drafts: user.drafts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update draft' });
  }
};

export const deleteDraft = async (req, res) => {
    const { userId, role } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.drafts = user.drafts.filter(d => d.role !== role);
      await user.save();
  
      res.status(200).json({ message: 'Draft deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete draft', error: err.message });
    }
  };
  

export const getUserDrafts = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ name: user.name, email: user.email, drafts: user.drafts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
};
