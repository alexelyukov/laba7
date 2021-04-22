properties([
    [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', numToKeepStr: '20']],
    disableConcurrentBuilds(),
    pipelineTriggers([[$class: 'GitHubPushTrigger']]),
    parameters([
        credentials(
            credentialType: 'com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl',
            defaultValue: 'dockerhub',
            description: '',
            name: 'DOCKERHUB_CREDENTIAL',
            required: true)
        ]
    )
])

pipeline {
    agent any

    stages {
      stage('\u2780 Build image'){
        steps {
          script {
            timestamps{
              ansiColor('xterm') {
                sh 'npm run docker-build'
              }
            }
          }
        }
      }
      stage('\u2781 Test image'){
        steps {
          script {
            timestamps{
              ansiColor('xterm') {
                sh 'npm run test'
              }
            }
          }
        }
      }
      stage('\u2782 Push image to Dockerhub'){
        steps {
          script {
            timestamps{
              ansiColor('xterm') {
                dockerLogin()
                sh 'npm run docker-push'
              }
            }
          }
        }
      }
      stage('\u2783 Deploy stack'){
        steps {
          script {
            timestamps{
              ansiColor('xterm') {
                sh 'npm run stack-deploy'
              }
            }
          }
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

def dockerLogin(){
    withCredentials([
            usernamePassword(credentialsId: params.DOCKERHUB_CREDENTIAL,
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD')
    ]) {
        sh 'echo $PASSWORD | docker login --username $USERNAME --password-stdin'
    }
}
