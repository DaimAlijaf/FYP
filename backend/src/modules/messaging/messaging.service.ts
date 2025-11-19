import { Message } from '../../models/message.model';
import { Conversation } from '../../models/conversation.model';
import { User } from '../user/user.model';
import { ApiError } from '../../utils/ApiError';
import { Types } from 'mongoose';
import { hashPassword } from '../../utils/password';

export const createMessage = async (senderId: string, receiverId: string, content: string, attachments?: string[]) => {
  // Validate users exist
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) {
    throw new ApiError(404, 'User not found');
  }

  if (senderId === receiverId) {
    throw new ApiError(400, 'Cannot send message to yourself');
  }

  // Find or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    const unreadMap = new Map();
    unreadMap.set(receiverId.toString(), 0);
    unreadMap.set(senderId.toString(), 0);
    
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      unreadCount: unreadMap,
    });
  }

  // Create message
  const message = await Message.create({
    conversationId: conversation._id.toString(),
    senderId,
    receiverId,
    content,
    isRead: false,
    attachments: attachments || [],
  });

  // Update conversation
  conversation.lastMessage = content.substring(0, 100); // Store preview
  conversation.lastMessageAt = new Date();
  const receiverUnreadCount = conversation.unreadCount.get(receiverId.toString()) || 0;
  conversation.unreadCount.set(receiverId.toString(), receiverUnreadCount + 1);
  await conversation.save();

  // Populate and return
  const populatedMessage = await Message.findById(message._id)
    .populate('senderId', 'name email profileImage isOnline')
    .populate('receiverId', 'name email profileImage isOnline');

  return populatedMessage;
};

export const getConversations = async (userId: string) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate('participants', 'name email profileImage isOnline accountType')
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  // Format conversations with unread count for current user
  const formattedConversations = conversations.map((conv) => {
    const unreadCount = conv.unreadCount.get(userId.toString()) || 0;
    return {
      ...conv.toObject(),
      unreadCount,
      otherUser: conv.participants.find((p: any) => p._id.toString() !== userId.toString()),
    };
  });

  return formattedConversations;
};

export const getMessages = async (userId: string, otherUserId: string, page: number = 1, limit: number = 50) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!conversation) {
    return { messages: [], pagination: { total: 0, page, limit, pages: 0 }, conversationId: null };
  }

  const messages = await Message.find({ conversationId: conversation._id.toString() })
    .populate('senderId', 'name profileImage isOnline accountType')
    .populate('receiverId', 'name profileImage isOnline accountType')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Message.countDocuments({ conversationId: conversation._id.toString() });

  return {
    messages: messages.reverse(),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    conversationId: conversation._id.toString(),
  };
};

export const markMessagesAsRead = async (userId: string, otherUserId: string) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  // Mark all unread messages from otherUserId as read
  await Message.updateMany(
    {
      conversationId: conversation._id.toString(),
      receiverId: userId,
      isRead: false,
    },
    {
      isRead: true,
    },
  );

  // Reset unread count for this user
  conversation.unreadCount.set(userId.toString(), 0);
  await conversation.save();

  return { success: true, message: 'Messages marked as read' };
};

export const getUnreadMessageCount = async (userId: string) => {
  const conversations = await Conversation.find({ participants: userId });
  let totalUnread = 0;
  conversations.forEach((conv) => {
    totalUnread += conv.unreadCount.get(userId.toString()) || 0;
  });
  return { count: totalUnread };
};

export const deleteMessage = async (messageId: string, userId: string) => {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, 'Message not found');
  }
  if (message.senderId.toString() !== userId.toString()) {
    throw new ApiError(403, 'Unauthorized to delete this message');
  }

  await Message.findByIdAndDelete(messageId);
  return { success: true, message: 'Message deleted' };
};

export const sendContactMessage = async (contactData: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) => {
  // Find or create admin user
  let admin = await User.findOne({ roles: 'admin' });
  
  if (!admin) {
    // Create a default admin user if none exists
    const hashedPassword = await hashPassword('admin123');
    admin = await User.create({
      name: 'Admin',
      email: 'admin@expertraah.com',
      password: hashedPassword,
      accountType: 'buyer',
      roles: ['admin'],
      isVerified: true,
    });
  }

  // Create or find guest user for this email
  let guestUser = await User.findOne({ email: contactData.email });
  
  if (!guestUser) {
    const hashedPassword = await hashPassword('guest_' + Math.random().toString(36).substring(7));
    guestUser = await User.create({
      name: `${contactData.firstName} ${contactData.lastName}`.trim() || 'Guest',
      email: contactData.email,
      password: hashedPassword,
      accountType: 'buyer',
      roles: ['guest'],
      isVerified: false,
    });
  }

  // Create message from guest to admin
  const message = await createMessage(
    guestUser._id.toString(),
    admin._id.toString(),
    `Contact Form Message:\n\nFrom: ${contactData.firstName} ${contactData.lastName}\nEmail: ${contactData.email}\n\n${contactData.message}`,
  );

  return {
    success: true,
    message: 'Message sent to admin successfully',
    data: message,
  };
};
