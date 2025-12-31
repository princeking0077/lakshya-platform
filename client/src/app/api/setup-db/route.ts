import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Import the init_db function from backend
        const initDB = require('../../../../backend/init_db');

        await initDB();

        return NextResponse.json({
            success: true,
            message: 'Database Initialized Successfully!'
        }, { status: 200 });
    } catch (error: any) {
        console.error('Setup Failed:', error);
        return NextResponse.json({
            success: false,
            message: 'Setup Failed: ' + error.message
        }, { status: 500 });
    }
}
