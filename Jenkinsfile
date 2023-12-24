#!groovy
 
/**
 * 参数
 *      agent                 部署机器
 *      dockerCredentialsId   docker账号
 *      makeTarget            makefile目标
 */
 
pipeline {
 
    agent {
        label "${env.agent}"
    }
 
    stages {
        stage('Deploy') {
            steps {
              withCredentials([usernamePassword(credentialsId: env.dockerCredentialsId, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh "docker login --username=${DOCKER_USERNAME} --password=${DOCKER_PASSWORD} ccr.ccs.tencentyun.com"
                sh "make ${makeTarget}"
              }
            }
        }
    }
}
