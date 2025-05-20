import { NextResponse } from 'next/server';
import { NotificationStatus } from '@/lib/types/notification';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'Contract Review Required',
    message: 'New contract awaiting your review',
    type: 'REVIEW',
    status: NotificationStatus.UNREAD,
    created_at: new Date('2025-05-19T10:00:00Z').getTime(),
    read_at: null,
  },
  {
    id: '2',
    title: 'Signature Request',
    message: 'Document ready for signature',
    type: 'SIGNATURE',
    status: NotificationStatus.UNREAD,
    created_at: new Date('2025-05-19T09:30:00Z').getTime(),
    read_at: null,
  },
];

export async function GET() {
  try {
    return NextResponse.json({ notifications: mockNotifications });
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json();
    
    // Update mock notification status
    const notifications = mockNotifications.map(notification =>
      notification.id === id
        ? { ...notification, status: NotificationStatus.READ, read_at: Date.now() }
        : notification
    );

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
