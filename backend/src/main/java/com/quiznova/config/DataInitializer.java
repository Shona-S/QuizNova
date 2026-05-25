package com.quiznova.config;

import com.quiznova.entity.Question;
import com.quiznova.entity.QuizTopic;
import com.quiznova.entity.Subject;
import com.quiznova.repository.QuestionRepository;
import com.quiznova.repository.QuizTopicRepository;
import com.quiznova.repository.SubjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SubjectRepository subjectRepository;
    private final QuizTopicRepository quizTopicRepository;
    private final QuestionRepository questionRepository;

    public DataInitializer(
            SubjectRepository subjectRepository,
            QuizTopicRepository quizTopicRepository,
            QuestionRepository questionRepository) {
        this.subjectRepository = subjectRepository;
        this.quizTopicRepository = quizTopicRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (subjectRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // 1. Subject: Artificial Intelligence
        Subject ai = Subject.builder()
                .name("Artificial Intelligence")
                .description("Explore the core concepts of Machine Learning, Neural Networks, Deep Learning, and search algorithms.")
                .build();
        ai = subjectRepository.save(ai);

        // AI Quiz 1: Machine Learning Basics
        QuizTopic mlBasics = QuizTopic.builder()
                .title("Machine Learning Basics")
                .description("Test your knowledge of supervised learning, unsupervised learning, classification, regression, and overfitting.")
                .difficultyLevel("EASY")
                .timeLimit(15)
                .subject(ai)
                .build();
        mlBasics = quizTopicRepository.save(mlBasics);

        Question q1 = Question.builder()
                .questionTitle("What is supervised learning?")
                .optionA("Learning with labeled training data")
                .optionB("Learning without any training data")
                .optionC("Learning with unlabeled training data")
                .optionD("Learning by trial and error reward signals")
                .correctAnswer("A")
                .marks(2)
                .quizTopic(mlBasics)
                .build();

        Question q2 = Question.builder()
                .questionTitle("Which algorithm is used for classification?")
                .optionA("K-Means Clustering")
                .optionB("Linear Regression")
                .optionC("Support Vector Machines (SVM)")
                .optionD("Apriori Algorithm")
                .correctAnswer("C")
                .marks(2)
                .quizTopic(mlBasics)
                .build();

        Question q3 = Question.builder()
                .questionTitle("What is overfitting?")
                .optionA("When a model performs poorly on training data but well on test data")
                .optionB("When a model performs exceptionally well on training data but poorly on unseen test data")
                .optionC("When a model is too simple to capture underlying patterns")
                .optionD("When a model training is stopped prematurely")
                .correctAnswer("B")
                .marks(2)
                .quizTopic(mlBasics)
                .build();

        questionRepository.saveAll(Arrays.asList(q1, q2, q3));

        // AI Quiz 2: Neural Networks
        QuizTopic neuralNets = QuizTopic.builder()
                .title("Neural Networks")
                .description("Test your knowledge on Perceptrons, Backpropagation, activation functions, and Multi-Layer Networks.")
                .difficultyLevel("MEDIUM")
                .timeLimit(20)
                .subject(ai)
                .build();
        neuralNets = quizTopicRepository.save(neuralNets);

        Question q4 = Question.builder()
                .questionTitle("What is a perceptron?")
                .optionA("A single-layer neural network / artificial neuron")
                .optionB("A type of activation function")
                .optionC("An optimizer used in deep learning")
                .optionD("A multi-layered recurrent model")
                .correctAnswer("A")
                .marks(2)
                .quizTopic(neuralNets)
                .build();

        Question q5 = Question.builder()
                .questionTitle("What is backpropagation?")
                .optionA("Moving weights forward through the network layers")
                .optionB("An algorithm to calculate gradients of loss function with respect to weights")
                .optionC("A method to initialize network weights randomly")
                .optionD("A regularization technique to prevent overfitting")
                .correctAnswer("B")
                .marks(2)
                .quizTopic(neuralNets)
                .build();

        Question q6 = Question.builder()
                .questionTitle("Which activation function is commonly used?")
                .optionA("Mean Squared Error")
                .optionB("Stochastic Gradient Descent")
                .optionC("Rectified Linear Unit (ReLU)")
                .optionD("L1 Regularization")
                .correctAnswer("C")
                .marks(2)
                .quizTopic(neuralNets)
                .build();

        questionRepository.saveAll(Arrays.asList(q4, q5, q6));


        // 2. Subject: Cloud Computing
        Subject cloud = Subject.builder()
                .name("Cloud Computing")
                .description("Understand cloud service models, virtualization, global infrastructure, and scalable system architectures.")
                .build();
        cloud = subjectRepository.save(cloud);

        // Cloud Quiz 1: AWS Fundamentals
        QuizTopic awsFundamentals = QuizTopic.builder()
                .title("AWS Fundamentals")
                .description("Evaluate your familiarity with core AWS services, including virtual compute, object storage, and basic database options.")
                .difficultyLevel("EASY")
                .timeLimit(15)
                .subject(cloud)
                .build();
        awsFundamentals = quizTopicRepository.save(awsFundamentals);

        Question q7 = Question.builder()
                .questionTitle("What is EC2?")
                .optionA("Elastic Compute Cloud - scalable virtual servers")
                .optionB("Simple Storage Service - object storage service")
                .optionC("Identity and Access Management - permission controls")
                .optionD("Relational Database Service - database hosting")
                .correctAnswer("A")
                .marks(2)
                .quizTopic(awsFundamentals)
                .build();

        Question q8 = Question.builder()
                .questionTitle("What is S3?")
                .optionA("Structured SQL Storage")
                .optionB("Simple Storage Service - scalable object storage")
                .optionC("Secure Shell Service")
                .optionD("Server Side Scripting")
                .correctAnswer("B")
                .marks(2)
                .quizTopic(awsFundamentals)
                .build();

        Question q9 = Question.builder()
                .questionTitle("What is IAM?")
                .optionA("Internet Address Manager")
                .optionB("Integrated Application Monitoring")
                .optionC("Identity and Access Management - secure access controls")
                .optionD("Internal Archive Manager")
                .correctAnswer("C")
                .marks(2)
                .quizTopic(awsFundamentals)
                .build();

        questionRepository.saveAll(Arrays.asList(q7, q8, q9));

        // Cloud Quiz 2: Cloud Security
        QuizTopic cloudSecurity = QuizTopic.builder()
                .title("Cloud Security")
                .description("Test your knowledge of key security concepts such as encryption, multi-factor authentication, and Zero-Trust networks.")
                .difficultyLevel("HARD")
                .timeLimit(20)
                .subject(cloud)
                .build();
        cloudSecurity = quizTopicRepository.save(cloudSecurity);

        Question q10 = Question.builder()
                .questionTitle("What is encryption?")
                .optionA("Converting plain text into unreadable ciphertext")
                .optionB("Creating backup copies of database files")
                .optionC("Restricting network traffic using firewalls")
                .optionD("Detecting malware signatures on servers")
                .correctAnswer("A")
                .marks(2)
                .quizTopic(cloudSecurity)
                .build();

        Question q11 = Question.builder()
                .questionTitle("What is multi-factor authentication?")
                .optionA("Validating user login requests using multiple password retries")
                .optionB("A security system requiring more than one verification factor to gain access")
                .optionC("Storing database passwords in multiple encrypted formats")
                .optionD("Restricting administration portals to specific IP subnets")
                .correctAnswer("B")
                .marks(2)
                .quizTopic(cloudSecurity)
                .build();

        Question q12 = Question.builder()
                .questionTitle("What is Zero Trust Security?")
                .optionA("A network model where all requests inside the perimeter are trusted implicitly")
                .optionB("A security framework requiring strict verification for every user and device trying to access resources")
                .optionC("An authentication process that bypasses passwords for known machines")
                .optionD("A hosting platform with no built-in firewalls")
                .correctAnswer("B")
                .marks(2)
                .quizTopic(cloudSecurity)
                .build();

        questionRepository.saveAll(Arrays.asList(q10, q11, q12));
    }
}
