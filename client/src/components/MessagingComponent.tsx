import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, MoreVertical, ArrowLeft, Circle, Clock, AlertTriangle, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface MessagingComponentProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: any[];
}

const MessagingComponent: React.FC<MessagingComponentProps> = ({ isOpen, onClose, projects = [] }) => {
  const { user, token } = useAuth();
  const {
    conversations,
    currentConversation,
    messages,
    isConnected,
    typingUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    loadConversations,
    initiateConversation
  } = useSocket();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [userProjects, setUserProjects] = useState<any[]>(projects);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update user projects when props change
  useEffect(() => {
    setUserProjects(projects);
  }, [projects]);

  // Load user's projects for GP users
  // Projects are now passed as props, no need to fetch separately

  // Handle creating new conversation
  const handleCreateNewMessage = async () => {
    console.log('handleCreateNewMessage called with:', { selectedProject, user: user?.email, messageContent: newMessageContent });
    
    if (!selectedProject || !user) {
      console.error('Missing data:', { selectedProject, user: user?.email });
      return;
    }

    setLoading(true);
    try {
      console.log('Initiating conversation...');
      const result = await initiateConversation(selectedProject, newMessageContent);
      console.log('Conversation initiated successfully:', result);
      
      setShowNewMessageDialog(false);
      setSelectedProject('');
      setNewMessageContent('');
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Error creating conversation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen, loadConversations]);

  const handleConversationSelect = (conversationId: string) => {
    if (currentConversation) {
      leaveConversation(currentConversation);
    }
    setSelectedConversation(conversationId);
    joinConversation(conversationId);
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage called with:', { messageInput, selectedConversation });
    
    if (!messageInput.trim() || !selectedConversation) {
      console.log('Validation failed:', { messageInputEmpty: !messageInput.trim(), noConversation: !selectedConversation });
      return;
    }

    const conversation = conversations.find(c => c.conversationId === selectedConversation);
    console.log('Found conversation:', conversation);
    
    if (!conversation) {
      console.error('No conversation found for selectedConversation:', selectedConversation);
      return;
    }

    try {
      console.log('Sending message...');
      const result = await sendMessage({
        projectId: conversation.projectId,
        receiverId: conversation.partnerId,
        content: messageInput.trim(),
        messageType: 'text',
        priority: 'medium'
      });
      console.log('Message sent successfully:', result);

      setMessageInput('');
      if (isTyping) {
        stopTyping(selectedConversation);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    if (selectedConversation) {
      if (value.trim() && !isTyping) {
        startTyping(selectedConversation);
        setIsTyping(true);
      } else if (!value.trim() && isTyping) {
        stopTyping(selectedConversation);
        setIsTyping(false);
      }

      // Clear typing indicator after 2 seconds of no typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) {
          stopTyping(selectedConversation);
          setIsTyping(false);
        }
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Awaiting PACC Approval':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'On Hold':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Planned':
        return <Circle className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle>Project Messages</CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex min-h-0">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Conversations</h3>
                {user?.role === 'gram_panchayat_user' && (
                  <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Start New Conversation</DialogTitle>
                        <DialogDescription>
                          Select a project to discuss with your District PACC Admin
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Select Project</label>
                          <Select value={selectedProject} onValueChange={setSelectedProject}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a project..." />
                            </SelectTrigger>
                            <SelectContent>
                              {userProjects.map((project) => (
                                <SelectItem key={project._id} value={project._id}>
                                  {project.projectName} - {project.status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Initial Message (Optional)</label>
                          <Textarea
                            placeholder="Hello, I would like to discuss this project..."
                            value={newMessageContent}
                            onChange={(e) => setNewMessageContent(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleCreateNewMessage}
                            disabled={!selectedProject || loading}
                          >
                            {loading ? 'Creating...' : 'Start Conversation'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <ScrollArea className="h-full">
                {conversations.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.conversationId}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedConversation === conversation.conversationId
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleConversationSelect(conversation.conversationId)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm truncate">
                              {conversation.projectName}
                            </h4>
                            {getStatusIcon(conversation.projectStatus)}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-1">
                          with {conversation.partnerName}
                        </p>
                        
                        {conversation.lastMessage && (
                          <>
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage.isFromMe ? 'You: ' : ''}
                              {conversation.lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  {(() => {
                    const conversation = conversations.find(c => c.conversationId === selectedConversation);
                    return conversation ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{conversation.projectName}</h3>
                          <p className="text-sm text-gray-600">
                            Chatting with {conversation.partnerName} ({conversation.partnerRole.replace('_', ' ')})
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(conversation.projectStatus)}
                            <span className="text-xs text-gray-500">{conversation.projectStatus}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : null}
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderId._id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId._id === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.messageType === 'rejection_reason' && (
                            <div className="flex items-center space-x-1 mb-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="text-xs font-medium">Project Rejection</span>
                            </div>
                          )}
                          
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{message.senderId.name}</span>
                            <div className="flex items-center space-x-1">
                              {message.priority && (
                                <Circle className={`h-2 w-2 ${getPriorityColor(message.priority)}`} />
                              )}
                              <span>
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicators */}
                    {selectedConversation && typingUsers[selectedConversation]?.length > 0 && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                          <div className="text-sm text-gray-600">
                            {typingUsers[selectedConversation].join(', ')} {
                              typingUsers[selectedConversation].length === 1 ? 'is' : 'are'
                            } typing...
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!messageInput.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingComponent;