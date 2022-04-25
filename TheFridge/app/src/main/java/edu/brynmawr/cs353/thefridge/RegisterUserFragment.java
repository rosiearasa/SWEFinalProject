package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * this class uses the fragment_registeruser.xml to set up the layout for entering the user information
 *
 */

public class RegisterUserFragment extends AppCompatActivity {

    String user = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        user = getIntent().getStringExtra("user");
        setContentView(R.layout.fragment_registeruser);
        Button registerMe = findViewById(R.id.registeruser);
        registerMe.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        registerUser(v);
                    }
                }
        );

        Button backtoHome = findViewById(R.id.backtomain);
        backtoHome.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        setContentView(R.layout.activity_main);
                    }
                }
        );

        }


    private void addUsertoDatabase(String name, int roomNumber){
        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                try {
                    //adduser url string with roomNumber and name
                    String end = "";


                    end = String.format("?name=%s&roomNumber=%s",name,roomNumber);
                    Log.v("url", end);
                    String encodedend = URLEncoder.encode(end, StandardCharsets.UTF_8.toString());

                    URL url = new URL("http://10.0.2.2:3000/adduser"+encodedend);

                    Log.v("COMPLETE", String.valueOf(url));

                    //open the connection and send the url through
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.connect();
                    url.openStream();

                    Log.v("message", "successfully added");

                }
                catch (Exception e) {
                    Log.v("error", e.toString());
                }
                    }
            );
            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(4, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            Log.v("message", "finished everything");
        }
        catch (Exception e) {
            e.printStackTrace();

        }

    }


        public  void registerUser(View view){
            EditText userNameView = (EditText) findViewById(R.id.name);
            String fullName = userNameView.getText().toString();
            Log.v("name",fullName);

            EditText roomNumberView = (EditText) findViewById(R.id.roomNumber);
            int roomNumber = Integer.parseInt(roomNumberView.getText().toString());
            Log.v("roomNumber", String.valueOf(roomNumber));
            addUsertoDatabase(fullName, roomNumber);

            //redirect to home page for fridge
            backtoHomePage();

        }
        public void successUser(){

        }
    public void backtoHomePage() {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    }

