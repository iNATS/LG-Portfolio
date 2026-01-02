import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => <Github className={className} />;
export const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => <Linkedin className={className} />;
export const MailIcon: React.FC<{ className?: string }> = ({ className }) => <Mail className={className} />;
export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => <Twitter className={className} />;
