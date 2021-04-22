pipeline {
    agent any

    stages {
        customStage('\u2780 Build image') {
            script {
                sh 'npm run docker-build'
            }
        }
        customStage('\u2781 Test image') {
            script {
                sh 'npm run test'
            }
        }
        customStage('\u2782 Push image to Dockerhub') {
            script {
                dockerLogin()
                sh 'npm run docker-push'
            }
        }
        customStage('\u2783 Deploy stack') {
            script {
                dockerLogin()
                sh 'npm run stack-deploy'
            }
        }
    }
    post {
        always {
            echo "Store test results"
            script {
                def junitReportFilesRoot = findFiles glob: "*.xml"
                if (junitReportFilesRoot.length > 0) {
                    junit "*.xml"
                }
                def junitReportFilesSubFolders = findFiles glob: "**/*.xml"
                if (junitReportFilesSubFolders.length > 0) {
                    junit "**/*.xml"
                }
            }
            echo "Cleanup"

            timestamps{
                ansiColor('xterm') {
                    script{
                        sh 'make clean'
                    }
                }
                deleteDir()
            }
        }
        changed {
            emailext(
                attachLog: true,
                body: """${currentBuild.result}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':Check console output at ${env.BUILD_URL} ${env.JOB_NAME} [${env.BUILD_NUMBER}]""",,
                compressLog: true,
                recipientProviders: [
                    [$class: 'CulpritsRecipientProvider'],
                    [$class: 'DevelopersRecipientProvider'],
                    [$class: 'RequesterRecipientProvider'],
                ],
                subject: """${currentBuild.result}: ${currentBuild.fullDisplayName}"""

            )
        }
    }
}

def customStage(String context, Closure closure) {
    stage(context){
        timestamps{
            ansiColor('xterm') {
              echo env.STAGE_NAME;
              try {
                closure();
              } catch (Exception err) {
                throw err;
              }
            }
        }
    }

}
