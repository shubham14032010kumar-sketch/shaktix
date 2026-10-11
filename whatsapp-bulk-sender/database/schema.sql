-- ====================================================================
-- SHAKTIX Full Enterprise CRM & WhatsApp Engine Database Schema
-- Modules: Contacts, Leads, Timeline, 2-Way Inbox, Orders, Tasks, Campaigns
-- Compatible with PostgreSQL & Supabase
-- ====================================================================

-- 1. Organizations (Multi-tenant)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    waba_id VARCHAR(100),
    phone_number_id VARCHAR(100),
    meta_access_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Team Members & Agents
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'agent', -- admin, manager, agent
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contacts & Customers (Core CRM)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(200),
    city VARCHAR(100),
    lead_stage VARCHAR(50) DEFAULT 'new_lead', -- new_lead, contacted, qualified, proposal_sent, closed_won, closed_lost
    lead_source VARCHAR(100) DEFAULT 'website', -- website, whatsapp, referral, cold_outreach, instagram
    deal_value NUMERIC(12, 2) DEFAULT 0.00,
    assigned_to UUID REFERENCES team_members(id),
    tags TEXT[] DEFAULT ARRAY['all']::TEXT[],
    opt_in_status BOOLEAN DEFAULT TRUE,
    opt_in_source VARCHAR(100) DEFAULT 'manual',
    is_suppressed BOOLEAN DEFAULT FALSE,
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(org_id, phone)
);

-- 4. Customer Activity & Timeline History
CREATE TABLE IF NOT EXISTS customer_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- contact_created, whatsapp_sent, whatsapp_received, stage_changed, order_placed, note_added, task_completed
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. WhatsApp 2-Way Conversations & Messages
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    phone VARCHAR(30) NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unread_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'open', -- open, pending, resolved, closed
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    assigned_to UUID REFERENCES team_members(id),
    is_unanswered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL, -- 'inbound' or 'outbound'
    message_type VARCHAR(20) DEFAULT 'text', -- text, template, image, document, interactive
    body TEXT NOT NULL,
    meta_message_id VARCHAR(150),
    status VARCHAR(20) DEFAULT 'sent', -- queued, sent, delivered, read, failed
    is_internal_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders & Invoices
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, partially_paid, failed
    fulfillment_status VARCHAR(50) DEFAULT 'in_progress', -- pending, in_progress, completed, delivered
    invoice_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tasks & Follow-ups
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    due_time TIME,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    status VARCHAR(30) DEFAULT 'pending', -- pending, completed, overdue, cancelled
    assigned_to UUID REFERENCES team_members(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. WhatsApp Bulk Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    target_tag VARCHAR(50) DEFAULT 'all',
    total_recipients INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    read_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    throttle_rate_per_sec INT DEFAULT 15,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Suppression & Opt-Out List
CREATE TABLE IF NOT EXISTS suppression_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(30) UNIQUE NOT NULL,
    reason VARCHAR(100) DEFAULT 'STOP_KEYWORD',
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance CRM operations
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON contacts(lead_stage);
CREATE INDEX IF NOT EXISTS idx_conversations_unanswered ON conversations(is_unanswered);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date, status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
