/**
 * Script to update faculty coordinator images in the database
 * 
 * Usage: npx tsx scripts/update-faculty-image.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function listFacultyMembers() {
    console.log('\n📋 Fetching faculty coordinators...\n');

    // Get faculty group
    const { data: facultyGroup } = await supabase
        .from('team_groups')
        .select('*')
        .eq('type', 'faculty')
        .single();

    if (!facultyGroup) {
        console.error('No faculty group found');
        return [];
    }

    // Get faculty members
    const { data: members, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('group_id', facultyGroup.id)
        .order('order_index');

    if (error) {
        console.error('Error fetching faculty members:', error);
        return [];
    }

    return members || [];
}

async function updateFacultyImage(memberId: number, newImageUrl: string) {
    const { error } = await supabase
        .from('team_members')
        .update({ image: newImageUrl })
        .eq('id', memberId)
        .select();

    if (error) {
        console.error('Error updating image:', error);
        return false;
    }

    console.log('✅ Successfully updated image!');
    return true;
}

async function main() {
    console.log('🎓 Faculty Coordinator Image Update Tool\n');
    console.log('='.repeat(50));

    const members = await listFacultyMembers();

    if (members.length === 0) {
        console.log('No faculty members found.');
        rl.close();
        return;
    }

    // Display all faculty members
    console.log('\nCurrent Faculty Coordinators:\n');
    members.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name}`);
        console.log(`   Role: ${member.role}`);
        console.log(`   Current Image: ${member.image || 'Not set'}`);
        console.log('');
    });

    const choice = await question('Enter the number of the faculty member to update (or "q" to quit): ');

    if (choice.toLowerCase() === 'q') {
        console.log('Exiting...');
        rl.close();
        return;
    }

    const memberIndex = parseInt(choice) - 1;

    if (isNaN(memberIndex) || memberIndex < 0 || memberIndex >= members.length) {
        console.log('Invalid selection.');
        rl.close();
        return;
    }

    const selectedMember = members[memberIndex];
    console.log(`\n✏️  Updating image for: ${selectedMember.name}\n`);

    console.log('Options for image URL:');
    console.log('1. Use a local file path (e.g., /images/faculty/er-sonam-singh.png)');
    console.log('2. Use a full URL (e.g., https://example.com/image.png)');
    console.log('3. Use Supabase Storage (you\'ll need to upload to storage first)\n');

    const imageUrl = await question('Enter the new image URL/path: ');

    if (!imageUrl.trim()) {
        console.log('No image URL provided. Exiting...');
        rl.close();
        return;
    }

    const confirm = await question(`\nConfirm update?\nMember: ${selectedMember.name}\nNew Image: ${imageUrl}\n(y/n): `);

    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        await updateFacultyImage(selectedMember.id, imageUrl.trim());
    } else {
        console.log('Update cancelled.');
    }

    rl.close();
}

main().catch(console.error);
