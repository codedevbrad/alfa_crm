// scripts/scrub-students.ts
// Script to completely remove all STUDENT users from the database
// ⚠️  WARNING: This will permanently delete ALL student users and their data!
// Run with: npm run scrub:students

import { prisma } from "@/lib/db/prisma";

async function scrubAllStudents() {
  console.log('🧹 DATABASE SCRUBBING: Removing ALL STUDENT users...\n');

  try {
    // First, get a count and preview of what will be deleted
    console.log('📊 Analyzing STUDENT users in database...');
    
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        studentProfile: true,
        accounts: true,
        sessions: true,
      }
    });

    if (students.length === 0) {
      console.log('✅ No STUDENT users found in database. Nothing to scrub.');
      return true;
    }

    console.log(`\n📋 Found ${students.length} STUDENT users to delete:`);
    
    let totalAccounts = 0;
    let totalSessions = 0;
    let totalProfiles = 0;

    students.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.name || 'Unnamed'} (${student.email})`);
      console.log(`      - Student Profile: ${student.studentProfile ? '✅' : '❌'}`);
      console.log(`      - Accounts: ${student.accounts.length}`);
      console.log(`      - Sessions: ${student.sessions.length}`);
      
      totalAccounts += student.accounts.length;
      totalSessions += student.sessions.length;
      if (student.studentProfile) totalProfiles++;
    });

    const totalRecords = students.length + totalProfiles + totalAccounts + totalSessions;

    console.log(`\n🗑️  DELETION SUMMARY:`);
    console.log(`   - ${students.length} STUDENT users`);
    console.log(`   - ${totalProfiles} Student profiles`);
    console.log(`   - ${totalAccounts} Accounts (OAuth)`);
    console.log(`   - ${totalSessions} Sessions`);
    console.log(`   - ${totalRecords} TOTAL records to be deleted`);

    // Final warning and confirmation
    console.log(`\n⚠️  FINAL WARNING: This will PERMANENTLY DELETE all ${students.length} STUDENT users!`);
    console.log('⚠️  This action CANNOT be undone!');
    console.log('⚠️  All student profiles, accounts, and sessions will be CASCADE deleted!');
    console.log('\n💡 If you want to delete just one student, use: npm run delete:user <email>');
    
    // 10 second countdown
    for (let i = 10; i > 0; i--) {
      process.stdout.write(`\r⏳ Proceeding in ${i} seconds... (Ctrl+C to cancel) `);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n');

    // Execute the deletion using CASCADE
    console.log('🗑️  Starting STUDENT user deletion...\n');

    let deletedCount = 0;
    let errorCount = 0;

    for (const student of students) {
      try {
        console.log(`   Deleting: ${student.name || 'Unnamed'} (${student.email})...`);
        
        // Delete user - CASCADE will handle StudentProfile, Account, Session
        await prisma.user.delete({
          where: { id: student.id }
        });
        
        deletedCount++;
        console.log(`   ✅ Deleted successfully (CASCADE removed related data)`);
        
      } catch (error) {
        errorCount++;
        console.log(`   ❌ Error deleting: ${error.message}`);
      }
    }

    console.log(`\n📊 DELETION COMPLETE:`);
    console.log(`   ✅ Successfully deleted: ${deletedCount} students`);
    console.log(`   ❌ Errors: ${errorCount} students`);

    // Verification
    console.log(`\n🔍 Verifying CASCADE deletion...`);
    const verification = await Promise.all([
      prisma.user.findMany({ where: { role: 'STUDENT' } }),
      prisma.studentProfile.findMany(),
      prisma.account.findMany({ where: { user: { role: 'STUDENT' } } }),
      prisma.session.findMany({ where: { user: { role: 'STUDENT' } } }),
    ]);

    const [remainingStudents, remainingProfiles, remainingAccounts, remainingSessions] = verification;
    
    console.log(`   - Remaining STUDENT users: ${remainingStudents.length}`);
    console.log(`   - Remaining student profiles: ${remainingProfiles.length}`);
    console.log(`   - Remaining student accounts: ${remainingAccounts.length}`);
    console.log(`   - Remaining student sessions: ${remainingSessions.length}`);

    const totalRemaining = remainingStudents.length + remainingProfiles.length + remainingAccounts.length + remainingSessions.length;

    if (totalRemaining === 0) {
      console.log(`\n🎉 SCRUBBING COMPLETE!`);
      console.log(`✅ All STUDENT users and related data successfully removed`);
      console.log(`✅ CASCADE deletion worked perfectly - ${totalRecords} total records deleted`);
      return true;
    } else {
      console.log(`\n⚠️  SCRUBBING INCOMPLETE!`);
      console.log(`❌ ${totalRemaining} records may still remain`);
      
      if (remainingStudents.length > 0) {
        console.log(`❌ ${remainingStudents.length} STUDENT users still exist:`);
        remainingStudents.forEach(s => console.log(`     - ${s.email}`));
      }
      
      return false;
    }

  } catch (error) {
    console.error('💥 Error during scrubbing:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Safety check for production
if (process.env.NODE_ENV === 'production') {
  console.log('🛑 SAFETY BLOCK: This script is disabled in production environment');
  console.log('💡 To run in production, remove the NODE_ENV check from the script');
  process.exit(1);
}

// Run the scrubbing
scrubAllStudents()
  .then(success => {
    console.log(`\n📊 Database scrubbing ${success ? 'COMPLETED SUCCESSFULLY' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Script crashed:', error);
    process.exit(1);
  });